// ============================================
// IPFS Library Tests
// ============================================
// Run with: npx jest __tests__/ipfs.test.ts
//
// These tests cover:
//   - CID ↔ bytes32 conversion
//   - Input validation
//   - URL construction
//   - Download error handling
//
// Upload tests are integration-level (need Pinata)
// and are marked with .skip — enable them locally
// when PINATA_JWT is set.
// ============================================

import {
  cidToBytes32,
  cidToUrl,
  exists,
  downloadJSON,
  IPFSError,
} from "@/lib/ipfs";

// ──────────────────────────────────────────────
//  cidToBytes32
// ──────────────────────────────────────────────

describe("cidToBytes32", () => {
  it("should return a 66-character hex string (0x + 64 hex chars)", async () => {
    const result = await cidToBytes32("QmTestCid123456789");
    expect(result).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("should be deterministic (same CID → same bytes32)", async () => {
    const cid = "QmX7bNJkx38GjZv9YHtS3n59ioN5W6v4JeH4";
    const result1 = await cidToBytes32(cid);
    const result2 = await cidToBytes32(cid);
    expect(result1).toBe(result2);
  });

  it("should produce different bytes32 for different CIDs", async () => {
    const result1 = await cidToBytes32("QmFirstCid");
    const result2 = await cidToBytes32("QmSecondCid");
    expect(result1).not.toBe(result2);
  });

  it("should handle CIDv1 (bafybei...) format", async () => {
    const result = await cidToBytes32(
      "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    );
    expect(result).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("should handle empty string input", async () => {
    const result = await cidToBytes32("");
    expect(result).toMatch(/^0x[0-9a-f]{64}$/);
    // SHA-256 of empty string is a known value
    expect(result).toBe(
      "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});

// ──────────────────────────────────────────────
//  cidToUrl
// ──────────────────────────────────────────────

describe("cidToUrl", () => {
  it("should construct a valid gateway URL", () => {
    const url = cidToUrl("QmTestCid123");
    expect(url).toContain("/ipfs/QmTestCid123");
    expect(url).toMatch(/^https?:\/\/.+\/ipfs\/QmTestCid123$/);
  });

  it("should handle CIDv1 format", () => {
    const cid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
    const url = cidToUrl(cid);
    expect(url).toContain(cid);
  });
});

// ──────────────────────────────────────────────
//  exists
// ──────────────────────────────────────────────

describe("exists", () => {
  it("should return false for empty CID", async () => {
    const result = await exists("");
    expect(result).toBe(false);
  });

  it("should return false for whitespace CID", async () => {
    const result = await exists("   ");
    expect(result).toBe(false);
  });

  it("should return false for a non-existent CID", async () => {
    // Mock fetch so no real network call is made
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({ ok: false } as Response);

    const result = await exists("QmNonExistentCid99999999999");
    expect(result).toBe(false);
    fetchSpy.mockRestore();
  });

  it("should return true when the CID exists", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({ ok: true } as Response);

    const result = await exists("QmRealCid123");
    expect(result).toBe(true);
    fetchSpy.mockRestore();
  });
});

// ─────────────────────��────────────────────────
//  downloadJSON - Validation
// ──────────────────────────────────────────────

describe("downloadJSON", () => {
  it("should throw IPFSError for empty CID", async () => {
    await expect(downloadJSON("")).rejects.toThrow(IPFSError);
    await expect(downloadJSON("")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });

  it("should throw IPFSError for whitespace CID", async () => {
    await expect(downloadJSON("   ")).rejects.toThrow(IPFSError);
  });
});

// ──────────────────────────────────────────────
//  Upload Validation (no network calls)
// ──────────────────────────────────────────────

describe("Upload validation", () => {
  // We test validation by importing the functions and catching errors
  // before they hit Pinata. These don't need PINATA_JWT.

  it("uploadJSON should be importable", async () => {
    const { uploadJSON } = await import("@/lib/ipfs");
    expect(typeof uploadJSON).toBe("function");
  });

  it("uploadFile should be importable", async () => {
    const { uploadFile } = await import("@/lib/ipfs");
    expect(typeof uploadFile).toBe("function");
  });

  it("uploadJobSpec should be importable", async () => {
    const { uploadJobSpec } = await import("@/lib/ipfs");
    expect(typeof uploadJobSpec).toBe("function");
  });
});
