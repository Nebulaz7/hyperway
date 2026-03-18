import hashlib
import json
import logging
import time

logger = logging.getLogger(__name__)

MOCK_COMPUTE_DURATION = 30  # seconds to simulate GPU work


def execute(job_id: int, spec: dict) -> dict:
    """
    Execute compute for a job given its spec.
    For the hackathon this is a mock — sleeps to simulate GPU work
    then returns a deterministic result based on the spec.

    In production this would:
    - Parse spec to determine model, inputs, parameters
    - Spin up a Docker container or subprocess
    - Run the actual GPU workload
    - Return real outputs

    Returns a result dict that gets uploaded to IPFS.
    """
    logger.info(f"Job {job_id} — starting compute (mock {MOCK_COMPUTE_DURATION}s)")

    task_type = spec.get("task", "unknown")
    model = spec.get("model", "unknown")
    inputs = spec.get("inputs", {})

    # Simulate GPU work
    start_time = time.time()
    time.sleep(MOCK_COMPUTE_DURATION)
    duration = round(time.time() - start_time, 2)

    # Generate deterministic mock output based on spec content
    spec_hash = hashlib.sha256(
        json.dumps(spec, sort_keys=True).encode()
    ).hexdigest()

    result = {
        "job_id": job_id,
        "task": task_type,
        "model": model,
        "status": "success",
        "outputs": {
            "result_hash": spec_hash,
            "mock": True,
            "inputs_received": list(inputs.keys()) if inputs else [],
        },
        "metrics": {
            "duration_seconds": duration,
            "gpu": "mock",
        },
    }

    logger.info(f"Job {job_id} — compute finished in {duration}s")
    return result