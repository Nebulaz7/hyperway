import logging
import os
import time

from contract import ContractClient
from ipfs_client import IPFSClient
import executor
import state

logger = logging.getLogger(__name__)

POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "15"))  # seconds between polls
MAX_RETRIES = 3


class Daemon:
    def __init__(self, contract: ContractClient, ipfs: IPFSClient):
        self.contract = contract
        self.ipfs = ipfs
        self.last_block: int = 0

    def run(self):
        """Main event loop — polls for JobAssigned events and processes them."""
        logger.info("Daemon starting up...")
        state.init_db()

        # Retry any jobs that were mid-flight when the daemon last stopped
        self._retry_pending()

        # Start from a few blocks behind to avoid missing recent events
        self.last_block = max(0, self.contract.get_latest_block() - 10)
        logger.info(f"Polling from block {self.last_block}")

        while True:
            try:
                self._poll_once()
            except Exception as e:
                logger.error(f"Unexpected error in poll loop: {e}", exc_info=True)
            time.sleep(POLL_INTERVAL)

    # ------------------------------------------------------------------ #
    #                         Internal helpers                            #
    # ------------------------------------------------------------------ #

    def _poll_once(self):
        """Single iteration: fetch new events and process each unseen job."""
        latest = self.contract.get_latest_block()
        if latest <= self.last_block:
            return  # no new blocks yet

        assigned = self.contract.get_assigned_jobs(
            from_block=self.last_block + 1,
            to_block=latest,
        )
        self.last_block = latest

        for event in assigned:
            job_id = event["job_id"]
            if state.is_job_known(job_id):
                logger.debug(f"Job {job_id} already tracked — skipping")
                continue
            self._handle_job(job_id)

    def _handle_job(self, job_id: int):
        """Validate on-chain state and kick off processing for a new job."""
        logger.info(f"Handling new job {job_id}")

        job = self.contract.get_job(job_id)
        if job is None:
            logger.error(f"Job {job_id}: could not read on-chain data — skipping")
            return

        if job["status_label"] != "ASSIGNED":
            logger.warning(
                f"Job {job_id}: unexpected status '{job['status_label']}' — skipping"
            )
            return

        if job["provider"].lower() != self.contract.address.lower():
            logger.warning(
                f"Job {job_id}: assigned to {job['provider']}, "
                f"not us ({self.contract.address}) — skipping"
            )
            return

        # bytes32 hex from contract → readable IPFS CID
        spec_cid_raw = "0x" + job["spec_cid"]
        spec_cid = self.ipfs.resolve_cid(spec_cid_raw)
        logger.info(f"Job {job_id}: spec CID = {spec_cid}")

        state.add_job(job_id, spec_cid)
        self._process_job(job_id, spec_cid)

    def _process_job(self, job_id: int, spec_cid: str):
        """Download spec → execute compute → upload result → submit proof."""
        attempts = state.get_attempts(job_id)
        if attempts >= MAX_RETRIES:
            logger.error(f"Job {job_id}: max retries exceeded — marking FAILED")
            state.mark_failed(job_id, "max_retries_exceeded")
            return

        state.increment_attempts(job_id)

        # 1. Download job spec from IPFS
        spec = self.ipfs.download_json(spec_cid)
        if spec is None:
            logger.error(f"Job {job_id}: failed to download spec (CID={spec_cid})")
            state.mark_failed(job_id, "spec_download_failed")
            return

        # 2. Execute compute (mock for hackathon, real workload in production)
        try:
            result = executor.execute(job_id, spec)
        except Exception as e:
            logger.error(f"Job {job_id}: compute raised exception: {e}", exc_info=True)
            state.mark_failed(job_id, f"compute_error: {e}")
            return

        # 3. Upload result to IPFS
        result_cid = self.ipfs.upload_json(result, name=f"job-{job_id}-result")
        if result_cid is None:
            logger.error(f"Job {job_id}: failed to upload result to IPFS")
            state.mark_failed(job_id, "result_upload_failed")
            return

        # 4. Submit proof on-chain
        tx_hash = self.contract.submit_proof(job_id, result_cid)
        if tx_hash is None:
            logger.error(f"Job {job_id}: failed to submit proof on-chain")
            state.mark_failed(job_id, "proof_submission_failed")
            return

        # 5. All done
        state.mark_completed(job_id, result_cid, tx_hash)
        logger.info(
            f"Job {job_id}: COMPLETED — result CID: {result_cid}, tx: {tx_hash}"
        )

    def _retry_pending(self):
        """On startup, retry jobs that were PENDING when the daemon last stopped."""
        pending = state.get_pending_jobs()
        if not pending:
            return

        logger.info(f"Found {len(pending)} pending job(s) from previous run — retrying")
        for row in pending:
            job_id = row["job_id"]
            spec_cid = row["spec_cid"]
            if row["attempts"] >= MAX_RETRIES:
                logger.warning(
                    f"Job {job_id}: skipping retry — max attempts already reached"
                )
                state.mark_failed(job_id, "max_retries_exceeded_on_restart")
                continue
            logger.info(
                f"Job {job_id}: retrying (attempt {row['attempts'] + 1}/{MAX_RETRIES})"
            )
            self._process_job(job_id, spec_cid)
