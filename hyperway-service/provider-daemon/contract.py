import logging
import time
from web3 import Web3
from web3.exceptions import ContractLogicError

logger = logging.getLogger(__name__)

# Only the events and functions the daemon actually needs
CONTRACT_ABI = [
    # Events
    {
        "type": "event",
        "name": "JobAssigned",
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "jobId", "type": "uint256"},
            {"indexed": True, "name": "provider", "type": "address"},
        ],
    },
    # Read functions
    {
        "type": "function",
        "name": "getJob",
        "stateMutability": "view",
        "inputs": [{"name": "jobId", "type": "uint256"}],
        "outputs": [
            {"name": "id", "type": "uint256"},
            {"name": "buyer", "type": "address"},
            {"name": "provider", "type": "address"},
            {"name": "specCID", "type": "bytes32"},
            {"name": "resultCID", "type": "bytes32"},
            {"name": "payment", "type": "uint256"},
            {"name": "computeUnits", "type": "uint256"},
            {"name": "status", "type": "uint8"},
            {"name": "createdAt", "type": "uint256"},
            {"name": "assignedAt", "type": "uint256"},
            {"name": "completedAt", "type": "uint256"},
            {"name": "deadline", "type": "uint256"},
        ],
    },
    # Write functions
    {
        "type": "function",
        "name": "submitProof",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "jobId", "type": "uint256"},
            {"name": "resultCID", "type": "bytes32"},
            {"name": "proof", "type": "bytes"},
        ],
        "outputs": [],
    },
]

# On-chain job status enum
JOB_STATUS = {
    0: "PENDING",
    1: "ASSIGNED",
    2: "COMPLETED",
    3: "FAILED",
    4: "DISPUTED",
}

MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds between retries


class ContractClient:
    def __init__(self, rpc_url: str, contract_address: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.account = self.w3.eth.account.from_key(private_key)
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address),
            abi=CONTRACT_ABI,
        )
        self.address = self.account.address

        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to RPC: {rpc_url}")

        logger.info(f"Connected to RPC — wallet: {self.address}")

    def get_latest_block(self) -> int:
        return self.w3.eth.block_number

    def get_assigned_jobs(self, from_block: int, to_block: int) -> list[dict]:
        """
        Fetch JobAssigned events for our wallet address in the given block range.
        Returns list of dicts with jobId and block number.
        """
        try:
            event_filter = self.contract.events.JobAssigned.get_logs(
                from_block=from_block,
                to_block=to_block,
                argument_filters={"provider": self.address},
            )

            jobs = []
            for log in event_filter:
                jobs.append({
                    "job_id": log["args"]["jobId"],
                    "block_number": log["blockNumber"],
                    "tx_hash": log["transactionHash"].hex(),
                })

            if jobs:
                logger.info(
                    f"Found {len(jobs)} assigned job(s) in blocks {from_block}–{to_block}"
                )

            return jobs

        except Exception as e:
            logger.error(f"Error fetching JobAssigned logs: {e}")
            return []

    def get_job(self, job_id: int) -> dict | None:
        """
        Read current job state directly from the contract.
        Used to verify job is still ASSIGNED before processing.
        """
        try:
            result = self.contract.functions.getJob(job_id).call()
            return {
                "id": result[0],
                "buyer": result[1],
                "provider": result[2],
                "spec_cid": result[3].hex(),  # bytes32 → hex string
                "result_cid": result[4].hex(),
                "payment": result[5],
                "compute_units": result[6],
                "status": result[7],
                "status_label": JOB_STATUS.get(result[7], "UNKNOWN"),
                "created_at": result[8],
                "assigned_at": result[9],
                "completed_at": result[10],
                "deadline": result[11],
            }
        except Exception as e:
            logger.error(f"Error fetching job {job_id}: {e}")
            return None

    def submit_proof(
        self, job_id: int, result_cid: str, proof: bytes = b""
    ) -> str | None:
        """
        Call submitProof on the contract.
        result_cid is a hex string (0x...) or IPFS CID — encoded to bytes32.
        Returns tx hash on success, None on failure.
        Retries up to MAX_RETRIES times.
        """
        # Encode result_cid to bytes32
        result_cid_bytes = self._encode_cid(result_cid)

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.info(
                    f"Submitting proof for job {job_id} (attempt {attempt}/{MAX_RETRIES})"
                )

                # Build transaction
                nonce = self.w3.eth.get_transaction_count(self.address)
                gas_price = self.w3.eth.gas_price

                tx = self.contract.functions.submitProof(
                    job_id,
                    result_cid_bytes,
                    proof,
                ).build_transaction({
                    "from": self.address,
                    "nonce": nonce,
                    "gasPrice": gas_price,
                })

                # Estimate gas and add 20% buffer
                estimated_gas = self.w3.eth.estimate_gas(tx)
                tx["gas"] = int(estimated_gas * 1.2)

                # Sign and send
                signed = self.w3.eth.account.sign_transaction(
                    tx, private_key=self.account.key
                )
                tx_hash = self.w3.eth.send_raw_transaction(
                    signed.raw_transaction
                )

                # Wait for receipt
                receipt = self.w3.eth.wait_for_transaction_receipt(
                    tx_hash, timeout=120
                )

                if receipt["status"] == 1:
                    tx_hash_hex = tx_hash.hex()
                    logger.info(
                        f"Proof submitted for job {job_id} — tx: {tx_hash_hex}"
                    )
                    return tx_hash_hex
                else:
                    logger.warning(
                        f"Transaction reverted for job {job_id} — tx: {tx_hash.hex()}"
                    )

            except ContractLogicError as e:
                # Contract revert — no point retrying
                logger.error(f"Contract reverted for job {job_id}: {e}")
                return None

            except Exception as e:
                logger.error(
                    f"submitProof attempt {attempt} failed for job {job_id}: {e}"
                )
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY * attempt)  # backoff

        logger.error(
            f"All {MAX_RETRIES} attempts failed for job {job_id}"
        )
        return None

    def _encode_cid(self, cid: str) -> bytes:
        """
        Encode a CID string to bytes32 for the contract.
        Truncates or pads to exactly 32 bytes.
        """
        cid_bytes = cid.encode("utf-8")
        if len(cid_bytes) > 32:
            cid_bytes = cid_bytes[:32]
        return cid_bytes.ljust(32, b"\x00")