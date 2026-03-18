import logging
import os
import time

logger = logging.getLogger(__name__)

# Minimum seconds between heartbeat writes — avoids spamming the DB.
HEARTBEAT_INTERVAL = 30


class SupabaseReporter:
    """
    Writes daemon heartbeats and per-job status updates to the
    ``daemon_status`` table in Supabase.

    All methods are no-ops when Supabase credentials are absent so the
    daemon can still operate without Supabase configured.
    """

    def __init__(self, provider_address: str):
        self._provider = provider_address.lower()
        self._last_heartbeat: float = 0.0
        self._client = None
        self._init_client()

    # ── internal ────────────────────────────────────────────────────────

    def _init_client(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            logger.info(
                "SUPABASE_URL / SUPABASE_SERVICE_KEY not set — "
                "daemon status reporting disabled"
            )
            return
        try:
            from supabase import create_client  # lazy import — optional dep

            self._client = create_client(url, key)
            logger.info("Supabase reporter ready")
        except Exception as exc:
            logger.error(f"Supabase reporter init failed: {exc}")

    def _insert(
        self,
        event_type: str,
        *,
        job_id: int | None = None,
        message: str = "",
        extra: dict | None = None,
    ):
        if self._client is None:
            return
        try:
            self._client.table("daemon_status").insert(
                {
                    "provider_address": self._provider,
                    "event_type": event_type,
                    "job_id": job_id,
                    "message": message,
                    "extra": extra or {},
                }
            ).execute()
        except Exception as exc:
            logger.warning(f"Supabase insert ({event_type}) failed: {exc}")

    # ── public API ───────────────────────────────────────────────────────

    def heartbeat(self):
        """
        Write a heartbeat row at most every HEARTBEAT_INTERVAL seconds.
        Call this from the main poll loop.
        """
        now = time.monotonic()
        if now - self._last_heartbeat < HEARTBEAT_INTERVAL:
            return
        self._last_heartbeat = now
        self._insert("heartbeat", message="daemon alive")

    def job_init(self, job_id: int, spec_cid: str):
        """Job was picked up and added to local state — pipeline starting."""
        self._insert(
            "job_init",
            job_id=job_id,
            message=f"Job {job_id} received",
            extra={"spec_cid": spec_cid},
        )

    def job_in_progress(self, job_id: int, stage: str):
        """
        Intermediate pipeline stage.
        stage examples: 'downloading_spec', 'executing', 'uploading_result'
        """
        self._insert(
            "job_in_progress",
            job_id=job_id,
            message=f"Job {job_id}: {stage}",
            extra={"stage": stage},
        )

    def job_proof_tx(self, job_id: int, tx_hash: str):
        """Proof transaction submitted on-chain."""
        self._insert(
            "job_proof_tx",
            job_id=job_id,
            message=f"Job {job_id}: proof tx sent",
            extra={"tx_hash": tx_hash},
        )

    def job_completed(self, job_id: int, result_cid: str, tx_hash: str):
        """Job finished successfully."""
        self._insert(
            "job_completed",
            job_id=job_id,
            message=f"Job {job_id}: completed",
            extra={"result_cid": result_cid, "tx_hash": tx_hash},
        )

    def job_failed(self, job_id: int, reason: str):
        """Job failed after exhausting retries."""
        self._insert(
            "job_failed",
            job_id=job_id,
            message=f"Job {job_id}: failed — {reason}",
            extra={"reason": reason},
        )
