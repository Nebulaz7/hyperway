import json
import logging
import requests

logger = logging.getLogger(__name__)

PINATA_PIN_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"
IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs"

TIMEOUT = 30  # seconds


class IPFSClient:
    def __init__(self, api_key: str, secret_key: str, gateway: str = IPFS_GATEWAY):
        self.headers = {
            "pinata_api_key": api_key,
            "pinata_secret_api_key": secret_key,
        }
        self.gateway = gateway.rstrip("/")

    def upload_json(self, data: dict, name: str = "result") -> str | None:
        """
        Upload a JSON object to IPFS via Pinata.
        Returns the IPFS CID on success, None on failure.
        """
        try:
            payload = {
                "pinataContent": data,
                "pinataMetadata": {"name": name},
            }

            response = requests.post(
                PINATA_PIN_URL,
                json=payload,
                headers={**self.headers, "Content-Type": "application/json"},
                timeout=TIMEOUT,
            )
            response.raise_for_status()

            cid = response.json()["IpfsHash"]
            logger.info(f"Uploaded to IPFS — CID: {cid}")
            return cid

        except requests.exceptions.RequestException as e:
            logger.error(f"IPFS upload failed: {e}")
            return None

    def download_json(self, cid: str) -> dict | None:
        """
        Download and parse a JSON file from IPFS by CID.
        Returns parsed dict on success, None on failure.
        """
        url = f"{self.gateway}/{cid}"
        try:
            response = requests.get(url, timeout=TIMEOUT)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Downloaded from IPFS — CID: {cid}")
            return data

        except requests.exceptions.JSONDecodeError:
            logger.error(f"IPFS content at {cid} is not valid JSON")
            return None

        except requests.exceptions.RequestException as e:
            logger.error(f"IPFS download failed for CID {cid}: {e}")
            return None

    def download_raw(self, cid: str) -> bytes | None:
        """
        Download raw bytes from IPFS by CID.
        Used if spec is not JSON (e.g. a binary file).
        """
        url = f"{self.gateway}/{cid}"
        try:
            response = requests.get(url, timeout=TIMEOUT)
            response.raise_for_status()
            logger.info(f"Downloaded raw from IPFS — CID: {cid}")
            return response.content

        except requests.exceptions.RequestException as e:
            logger.error(f"IPFS raw download failed for CID {cid}: {e}")
            return None

    def resolve_cid(self, raw: str) -> str:
        """
        The contract stores CIDs as bytes32 (hex string).
        This decodes it back to a readable CID string.
        raw is either:
          - a 0x-prefixed hex string from the contract (bytes32)
          - already a plain CID string (passthrough)
        """
        if not raw.startswith("0x"):
            return raw  # already a plain CID

        try:
            # Strip 0x, decode hex to bytes, strip null padding, decode to string
            hex_str = raw[2:]
            decoded = bytes.fromhex(hex_str).rstrip(b"\x00").decode("utf-8")
            return decoded
        except Exception as e:
            logger.error(f"Failed to resolve CID from bytes32 {raw}: {e}")
            return raw