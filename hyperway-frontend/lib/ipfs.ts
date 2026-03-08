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

import { PinataSDK } from "pinata";

// ──────────────────────────────────────────────
//  Constants
// ──────────────────────────────────────────────

const PINATA_GATEWAY =
  process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
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

// ──────────────────────────────────────────────
//  Server-side Pinata Client
// ──────────────────────────────────────────────

/**
 * Get the Pinata SDK instance. Only usable server-side (API routes).
 * Throws if PINATA_JWT is not set.
 */
function getPinata(): PinataSDK {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new IPFSError(
      "PINATA_JWT environment variable is not set",
      "CONFIG_ERROR",
    );
  }

  return new PinataSDK({ pinataJwt: jwt });
}

// ══════════════════════════════════════════════
//  UPLOAD FUNCTIONS (server-side only)
// ══════════════════════════════════════════════

/**
 * Upload a File to IPFS via Pinata.
 *
 * @param file - File object to upload
 * @param name - Human-readable name for Pinata pin
 * @param metadata - Optional key-value metadata for the pin
 * @returns UploadResult with CID, bytes32, URL, and size
 *
 * @example
 * ```ts
 * const result = await uploadFile(file, "training-data.zip", { jobId: "1" });
 * console.log(result.cid);     // "QmX7b..."
 * console.log(result.bytes32); // "0xabcd..."
 * console.log(result.url);     // "https://gateway.pinata.cloud/ipfs/QmX7b..."
 * ```
 */
export async function uploadFile(
  file: File,
  name?: string,
  metadata?: Record<string, string>,
): Promise<UploadResult> {
  // Validate
  if (file.size === 0) {
    throw new IPFSError("File is empty", "VALIDATION_ERROR");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new IPFSError(
      `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      "VALIDATION_ERROR",
    );
  }

  const pinata = getPinata();
  const pinName = name || file.name || "hyperway-upload";

  const response = await withRetry(async () => {
    return pinata.upload.public
      .file(file)
      .name(pinName)
      .keyvalues({
        app: "hyperway",
        type: "file",
        ...metadata,
      });
  }, `uploadFile(${pinName})`);

  const cid = response.cid;
  const bytes32 = await cidToBytes32(cid);

  return {
    cid,
    bytes32,
    url: cidToUrl(cid),
    size: file.size,
  };
}

/**
 * Upload a JSON object to IPFS via Pinata.
 *
 * @param data - Any JSON-serializable object
 * @param name - Human-readable name for the pin
 * @param metadata - Optional key-value metadata
 * @returns UploadResult with CID, bytes32, URL, and size
 *
 * @example
 * ```ts
 * const spec: JobSpec = { name: "SDXL Inference", ... };
 * const result = await uploadJSON(spec, "job-spec-1", { jobType: "inference" });
 * ```
 */
export async function uploadJSON(
  data: Record<string, unknown>,
  name?: string,
  metadata?: Record<string, string>,
): Promise<UploadResult> {
  if (!data || typeof data !== "object") {
    throw new IPFSError("Data must be a non-null object", "VALIDATION_ERROR");
  }

  const pinata = getPinata();
  const pinName = name || "hyperway-json";
  const jsonString = JSON.stringify(data);

  const response = await withRetry(async () => {
    return pinata.upload.public
      .json(data)
      .name(pinName)
      .keyvalues({
        app: "hyperway",
        type: "json",
        ...metadata,
      });
  }, `uploadJSON(${pinName})`);

  const cid = response.cid;
  const bytes32 = await cidToBytes32(cid);

  return {
    cid,
    bytes32,
    url: cidToUrl(cid),
    size: new TextEncoder().encode(jsonString).byteLength,
  };
}

/**
 * Upload a job specification to IPFS.
 * Validates the spec structure before uploading.
 *
 * @param spec - JobSpec object
 * @returns UploadResult
 */
export async function uploadJobSpec(spec: JobSpec): Promise<UploadResult> {
  // Validate required fields
  if (!spec.name?.trim()) {
    throw new IPFSError("Job spec name is required", "VALIDATION_ERROR");
  }
  if (!spec.model?.trim()) {
    throw new IPFSError("Job spec model is required", "VALIDATION_ERROR");
  }
  if (
    !spec.requirements?.minComputeUnits ||
    spec.requirements.minComputeUnits <= 0
  ) {
    throw new IPFSError(
      "Job spec must have positive compute units",
      "VALIDATION_ERROR",
    );
  }

  const fullSpec = {
    ...spec,
    version: spec.version || "1.0.0",
    createdAt: spec.createdAt || new Date().toISOString(),
  };

  return uploadJSON(
    fullSpec as unknown as Record<string, unknown>,
    `job-spec-${spec.name.replace(/\s+/g, "-").toLowerCase()}`,
    { type: "job-spec", model: spec.model },
  );
}

/**
 * Upload a job result to IPFS.
 *
 * @param result - JobResult object
 * @returns UploadResult
 */
export async function uploadJobResult(
  result: JobResult,
): Promise<UploadResult> {
  if (!result.jobId || result.jobId <= 0) {
    throw new IPFSError(
      "Job result must have a valid jobId",
      "VALIDATION_ERROR",
    );
  }

  const fullResult = {
    ...result,
    completedAt: result.completedAt || new Date().toISOString(),
  };

  return uploadJSON(
    fullResult as unknown as Record<string, unknown>,
    `job-result-${result.jobId}`,
    { type: "job-result", jobId: String(result.jobId) },
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
