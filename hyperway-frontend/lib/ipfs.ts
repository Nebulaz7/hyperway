// ============================================
// HYPERWAY - IPFS UTILITIES (via Pinata SDK)
// ============================================
//
// Used for:
//   1. Job specs   — buyer uploads JSON describing the compute job
//   2. Job results — provider uploads compute output
//   3. GPU specs   — optional off-chain metadata for providers
//
// Architecture:
//   Upload:   Browser → Next.js API route → Pinata → IPFS
//   Download: Browser → Pinata Gateway → IPFS
//
// CID handling:
//   IPFS returns a CID string (e.g. "QmX7b...").
//   The contract stores bytes32, so we convert with cidToBytes32().
//   The frontend converts back with bytes32ToCid() for display/download.
// ============================================

// ──────────────────────────────────────────────
//  Constants
// ──────────────────────────────────────────────

const PINATA_GATEWAY =
  process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// ──────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────

export interface UploadResult {
  cid: string; // Full IPFS CID string
  bytes32: `0x${string}`; // bytes32 for the contract
  url: string; // Gateway URL for fetching
  size: number; // File size in bytes
}

export interface JobSpec {
  name: string; // Human-readable job name
  description: string; // What this compute job does
  model: string; // Model name/path (e.g. "stabilityai/sdxl-turbo")
  framework: string; // "pytorch" | "tensorflow" | "onnx" | etc.
  inputData?: string; // CID of input dataset (if applicable)
  parameters: Record<string, unknown>; // Model params, hyperparams, etc.
  requirements: {
    minVRAM: number; // Minimum VRAM in GB
    minComputeUnits: number; // Estimated seconds
    preferredGPU?: string; // e.g. "RTX 4090", "A100"
  };
  version: string; // Spec schema version
  createdAt: string; // ISO timestamp
}

export interface JobResult {
  jobId: number;
  outputCID?: string; // CID of the output file/archive
  metrics: Record<string, unknown>; // Accuracy, loss, timing, etc.
  logs?: string; // CID of execution logs
  completedAt: string; // ISO timestamp
  providerInfo: {
    gpu: string;
    computeTimeSeconds: number;
  };
}

// ──────────────────────────────────────────────
//  Errors
// ──────────────────────────────────────────────

export class IPFSError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "IPFSError";
  }
}

// ──────────────────────────────────────────────
//  CID ↔ bytes32 Conversion
// ──────────────────────────────────────────────

/**
 * Convert an IPFS CID string to a bytes32 hex string for the contract.
 *
 * Strategy: SHA-256 hash the CID string, producing exactly 32 bytes.
 * This is a one-way mapping — you cannot reconstruct the CID from bytes32.
 * The full CID is stored in Supabase alongside the bytes32 for lookup.
 *
 * @param cid - Full IPFS CID string (e.g. "QmX7b..." or "bafybeig...")
 * @returns bytes32 hex string (e.g. "0xabcd...1234")
 */
export async function cidToBytes32(cid: string): Promise<`0x${string}`> {
  const encoder = new TextEncoder();
  const data = encoder.encode(cid);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  const hex = Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}` as `0x${string}`;
}

/**
 * Build a gateway URL from a CID.
 * @param cid - IPFS CID string
 * @returns Full gateway URL for fetching the content
 */
export function cidToUrl(cid: string): string {
  return `${PINATA_GATEWAY}/${cid}`;
}

// ──────────────────────────────────────────────
//  Retry Helper
// ──────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(
          `[IPFS] ${context} - attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${delay}ms...`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new IPFSError(
    `${context} failed after ${MAX_RETRIES} attempts`,
    "RETRY_EXHAUSTED",
    lastError,
  );
}

// ══════════════════════════════════════════════
//  DOWNLOAD FUNCTIONS (client-safe)
// ══════════════════════════════════════════════

/**
 * Download and parse JSON content from IPFS by CID.
 *
 * @param cid - IPFS CID string
 * @returns Parsed JSON object
 *
 * @example
 * ```ts
 * const spec = await downloadJSON<JobSpec>("QmX7b...");
 * console.log(spec.name); // "SDXL Inference"
 * ```
 */
export async function downloadJSON<T = Record<string, unknown>>(
  cid: string,
): Promise<T> {
  if (!cid?.trim()) {
    throw new IPFSError("CID is required", "VALIDATION_ERROR");
  }

  const url = cidToUrl(cid);

  const response = await withRetry(async () => {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30_000), // 30 second timeout
    });

    if (!res.ok) {
      throw new IPFSError(
        `Gateway returned ${res.status}: ${res.statusText}`,
        "GATEWAY_ERROR",
      );
    }

    return res;
  }, `downloadJSON(${cid})`);

  try {
    return (await response.json()) as T;
  } catch {
    throw new IPFSError(
      "Failed to parse response as JSON — content may not be JSON",
      "PARSE_ERROR",
    );
  }
}

/**
 * Download raw content from IPFS as a Blob.
 *
 * @param cid - IPFS CID string
 * @returns Blob of the file content
 */
export async function downloadFile(cid: string): Promise<Blob> {
  if (!cid?.trim()) {
    throw new IPFSError("CID is required", "VALIDATION_ERROR");
  }

  const url = cidToUrl(cid);

  const response = await withRetry(async () => {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(120_000), // 2 minute timeout for large files
    });

    if (!res.ok) {
      throw new IPFSError(
        `Gateway returned ${res.status}: ${res.statusText}`,
        "GATEWAY_ERROR",
      );
    }

    return res;
  }, `downloadFile(${cid})`);

  return response.blob();
}

/**
 * Check if content exists on IPFS (HEAD request to gateway).
 *
 * @param cid - IPFS CID to check
 * @returns true if content is accessible
 */
export async function exists(cid: string): Promise<boolean> {
  if (!cid?.trim()) return false;

  try {
    const res = await fetch(cidToUrl(cid), {
      method: "HEAD",
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
