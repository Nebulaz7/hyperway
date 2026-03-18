import sqlite3
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

DB_PATH = "daemon_state.db"


def init_db():
    """Initialize SQLite database and create jobs table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS processed_jobs (
            job_id      INTEGER PRIMARY KEY,
            status      TEXT NOT NULL,
            spec_cid    TEXT,
            result_cid  TEXT,
            tx_hash     TEXT,
            attempts    INTEGER DEFAULT 0,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        )
    """)
    conn.commit()
    conn.close()
    logger.info("State DB initialized")


def is_job_known(job_id: int) -> bool:
    """Return True if we have already seen this job."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT 1 FROM processed_jobs WHERE job_id = ?", (job_id,)
    )
    result = cursor.fetchone()
    conn.close()
    return result is not None


def add_job(job_id: int, spec_cid: str):
    """Record a newly assigned job as PENDING."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR IGNORE INTO processed_jobs (job_id, status, spec_cid)
        VALUES (?, 'PENDING', ?)
        """,
        (job_id, spec_cid),
    )
    conn.commit()
    conn.close()
    logger.debug(f"Job {job_id} added to state DB")


def mark_completed(job_id: int, result_cid: str, tx_hash: str):
    """Mark a job as completed after successful proof submission."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE processed_jobs
        SET status = 'COMPLETED', result_cid = ?, tx_hash = ?, updated_at = ?
        WHERE job_id = ?
        """,
        (result_cid, tx_hash, datetime.utcnow().isoformat(), job_id),
    )
    conn.commit()
    conn.close()
    logger.info(f"Job {job_id} marked COMPLETED — tx: {tx_hash}")


def mark_failed(job_id: int, reason: str):
    """Mark a job as permanently failed after exhausting retries."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE processed_jobs
        SET status = 'FAILED', result_cid = ?, updated_at = ?
        WHERE job_id = ?
        """,
        (reason, datetime.utcnow().isoformat(), job_id),
    )
    conn.commit()
    conn.close()
    logger.warning(f"Job {job_id} marked FAILED — reason: {reason}")


def increment_attempts(job_id: int):
    """Increment retry counter for a job."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE processed_jobs
        SET attempts = attempts + 1, updated_at = ?
        WHERE job_id = ?
        """,
        (datetime.utcnow().isoformat(), job_id),
    )
    conn.commit()
    conn.close()


def get_attempts(job_id: int) -> int:
    """Return how many times we have attempted this job."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT attempts FROM processed_jobs WHERE job_id = ?", (job_id,)
    )
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else 0


def get_pending_jobs() -> list[dict]:
    """Return all jobs in PENDING state — for retry on restart."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM processed_jobs WHERE status = 'PENDING'"
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]