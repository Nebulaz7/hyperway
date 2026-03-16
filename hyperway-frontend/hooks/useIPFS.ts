"use client";

import { useState, useCallback } from "react";
import type { UploadResult, JobSpec, JobResult } from "@/lib/ipfs";
import { downloadJSON, downloadFile, cidToUrl, exists, cidToBytes32 } from "@/lib/ipfs";

// ──────────────────────────────────────────────
//  Upload Hooks (call API routes)
// ──────────────────────────────────────────────

interface UseUploadReturn {
  upload: (...args: any[]) => Promise<UploadResult>;
  result: UploadResult | null;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

/** Upload a JSON object to IPFS (via API route) */
export function useUploadJSON(): UseUploadReturn {
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      data: Record<string, unknown>,
      name?: string,
      metadata?: Record<string, string>,
    ) => {
      setIsUploading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("/api/ipfs/upload-json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, name, metadata }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        const partialResult = await res.json();
        const bytes32 = await cidToBytes32(partialResult.cid);
        const uploadResult: UploadResult = { ...partialResult, bytes32 };
        console.log("[IPFS] Upload JSON Success:", uploadResult);
        setResult(uploadResult);
        return uploadResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return { upload, result, isUploading, error, reset };
}

/** Upload a File to IPFS (via API route) */
export function useUploadFile(): UseUploadReturn {
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, name?: string, metadata?: Record<string, string>) => {
      setIsUploading(true);
      setError(null);
      setResult(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (name) formData.append("name", name);
        if (metadata) {
          for (const [key, value] of Object.entries(metadata)) {
            formData.append(key, value);
          }
        }

        const res = await fetch("/api/ipfs/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        const partialResult = await res.json();
        const bytes32 = await cidToBytes32(partialResult.cid);
        const uploadResult: UploadResult = { ...partialResult, bytes32 };
        console.log("[IPFS] Upload File Success:", uploadResult);
        setResult(uploadResult);
        return uploadResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return { upload, result, isUploading, error, reset };
}

/** Upload a job spec to IPFS (convenience wrapper) */
export function useUploadJobSpec() {
  const { upload: uploadJSON, ...rest } = useUploadJSON();

  const uploadSpec = useCallback(
    async (spec: JobSpec) => {
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
    },
    [uploadJSON],
  );

  return { uploadSpec, ...rest };
}

/** Upload a job result to IPFS (convenience wrapper) */
export function useUploadJobResult() {
  const { upload: uploadJSON, ...rest } = useUploadJSON();

  const uploadResult = useCallback(
    async (jobResult: JobResult) => {
      const fullResult = {
        ...jobResult,
        completedAt: jobResult.completedAt || new Date().toISOString(),
      };

      return uploadJSON(
        fullResult as unknown as Record<string, unknown>,
        `job-result-${jobResult.jobId}`,
        { type: "job-result", jobId: String(jobResult.jobId) },
      );
    },
    [uploadJSON],
  );

  return { uploadResult, ...rest };
}

// ──────────────────────────────────────────────
//  Download Hooks (direct from gateway)
// ──────────────────────────────────────────────

/** Download and parse JSON from IPFS */
export function useDownloadJSON<T = Record<string, unknown>>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (cid: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await downloadJSON<T>(cid);
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { download, data, isLoading, error };
}

/** Download a file from IPFS as a Blob */
export function useDownloadFile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (cid: string, filename?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await downloadFile(cid);

      // Trigger browser download
      if (filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      return blob;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { download, isLoading, error };
}

// ──────────────────────────────────────────────
//  Utility Re-exports for Components
// ──────────────────────────────────────────────

export { cidToUrl, exists };
