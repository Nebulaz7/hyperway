import logging
import os
import sys

from dotenv import load_dotenv

# Load .env before any module that reads environment variables
load_dotenv()

# Add provider-daemon directory to path so its modules can import each other
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "provider-daemon"))

from contract import ContractClient  # noqa: E402
from ipfs_client import IPFSClient   # noqa: E402
from daemon import Daemon             # noqa: E402

REQUIRED_ENV = [
    "RPC_URL",
    "CONTRACT_ADDRESS",
    "PROVIDER_PRIVATE_KEY",
    "PINATA_API_KEY",
    "PINATA_SECRET_KEY",
]


def setup_logging():
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def main():
    setup_logging()
    logger = logging.getLogger(__name__)

    missing = [k for k in REQUIRED_ENV if not os.getenv(k)]
    if missing:
        logger.error(f"Missing required environment variables: {', '.join(missing)}")
        sys.exit(1)

    contract = ContractClient(
        rpc_url=os.environ["RPC_URL"],
        contract_address=os.environ["CONTRACT_ADDRESS"],
        private_key=os.environ["PROVIDER_PRIVATE_KEY"],
    )

    ipfs = IPFSClient(
        api_key=os.environ["PINATA_API_KEY"],
        secret_key=os.environ["PINATA_SECRET_KEY"],
    )

    daemon = Daemon(contract=contract, ipfs=ipfs)
    daemon.run()


if __name__ == "__main__":
    main()
