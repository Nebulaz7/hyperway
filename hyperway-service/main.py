import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

provider_dir = Path(__file__).resolve().parent / "provider"
if str(provider_dir) not in sys.path:
    sys.path.insert(0, str(provider_dir))

from contract import ContractClient
from ipfs_client import IPFSClient
from daemon import Daemon

REQUIRED_ENV = [
    "RPC_URL",
    "CONTRACT_ADDRESS",
    "PROVIDER_PRIVATE_KEY",
    "PINATA_JWT",
    "PINATA_GATEWAY",
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
        jwt=os.environ["PINATA_JWT"],
        gateway=os.environ["PINATA_GATEWAY"],
    )

    daemon = Daemon(contract=contract, ipfs=ipfs)
    daemon.run()


if __name__ == "__main__":
    main()