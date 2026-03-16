// ============================================
// HYPERWAY - IPFS SERVER UTILITIES (Pinata SDK)
// ============================================
// This file is server-side ONLY. It uses the Pinata SDK
// which depends on Node.js modules like 'fs'.
// ============================================

import { PinataSDK } from "pinata";
import { 
  IPFSError, 
  UploadResult, 
  JobSpec, 
  JobResult, 
  cidToBytes32, 
  cidToUrl 
} from "./ipfs";

// ──────────────────────────────────────────────
//  Constants
// ──────────────────────────────────────────────

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

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
          `[IPFS-SERVER] ${context} - attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${delay}ms...`,
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
//  UPLOAD FUNCTIONS
// ══════════════════════════════════════════════

export async function uploadFile(
  file: File,
  name?: string,
  metadata?: Record<string, string>,
): Promise<UploadResult> {
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

export async function uploadJobSpec(spec: JobSpec): Promise<UploadResult> {
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
