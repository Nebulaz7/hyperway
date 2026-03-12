"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUploadJobSpec, useUploadFile } from "@/hooks/useIPFS";
import { useSubmitJob } from "@/hooks/useMarketplace";
import type { JobSpec } from "@/lib/ipfs";

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const FRAMEWORKS = ["pytorch", "tensorflow", "onnx", "jax", "triton"] as const;
const GPU_OPTIONS = ["Any GPU", "RTX 4090", "RTX 3090", "A100", "H100", "T4"] as const;
const MAX_FREE_TXS = 5;

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

type SubmissionStep = "form" | "uploading" | "signing" | "confirming" | "success" | "error";

interface FormState {
  name: string;
  description: string;
  model: string;
  framework: (typeof FRAMEWORKS)[number];
  minVRAM: number;
  computeUnits: number;
  preferredGPU: string;
  paymentAmount: string;
  parameters: string;
  useGasless: boolean;
  useXCM: boolean;
}

const initialForm: FormState = {
  name: "",
  description: "",
  model: "",
  framework: "pytorch",
  minVRAM: 8,
  computeUnits: 3600,
  preferredGPU: "Any GPU",
  paymentAmount: "0.5",
  parameters: '{\n  "batch_size": 32,\n  "num_epochs": 10\n}',
  useGasless: false,
  useXCM: false,
};

// ─────────────────────────────────────────────
//  Page Component
// ─────────────────────────────────────────────

export default function SubmitJobPage() {
  const { address, isConnected } = useAccount();
  const { uploadSpec, isUploading, error: ipfsError, reset: resetIPFS } = useUploadJobSpec();
  const { upload: uploadFile, isUploading: isUploadingFile } = useUploadFile();
  const { submitJob, hash, isPending, isConfirming, isSuccess, error: txError } = useSubmitJob();

  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<SubmissionStep>("form");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [freeTxCount, setFreeTxCount] = useState(MAX_FREE_TXS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form Handlers ──

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── Submit Handler ──

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);

      if (!isConnected || !address) {
        setErrorMsg("Please connect your wallet first.");
        return;
      }

      // Validate
      if (!form.name.trim()) { setErrorMsg("Job name is required."); return; }
      if (!form.model.trim()) { setErrorMsg("Model name is required."); return; }
      if (form.computeUnits <= 0) { setErrorMsg("Compute units must be positive."); return; }
      if (Number(form.paymentAmount) <= 0) { setErrorMsg("Payment must be greater than 0."); return; }

      let parsedParams: Record<string, unknown> = {};
      try {
        parsedParams = JSON.parse(form.parameters || "{}");
      } catch {
        setErrorMsg("Parameters must be valid JSON.");
        return;
      }

      try {
        // Step 1: Upload to IPFS
        setStep("uploading");

        const spec: JobSpec = {
          name: form.name,
          description: form.description,
          model: form.model,
          framework: form.framework,
          parameters: parsedParams,
          requirements: {
            minVRAM: form.minVRAM,
            minComputeUnits: form.computeUnits,
            preferredGPU: form.preferredGPU === "Any GPU" ? undefined : form.preferredGPU,
          },
          version: "1.0.0",
          createdAt: new Date().toISOString(),
        };

        // Upload optional input file first
        if (uploadedFile) {
          const fileResult = await uploadFile(uploadedFile, `input-${form.name}`);
          (spec as any).inputData = fileResult.cid;
        }

        const ipfsResult = await uploadSpec(spec);

        // Step 2: Submit to smart contract
        setStep("signing");

        if (form.useGasless && freeTxCount > 0) {
          // Gasless: would call forwarder — for now just submit normally
          // TODO: Implement actual gasless relay call
          setFreeTxCount((prev) => prev - 1);
        }

        console.log("[submitJob] Parameters prepared:", {
          bytes32: ipfsResult.bytes32,
          cid: ipfsResult.cid,
          computeUnits: BigInt(form.computeUnits),
          paymentAmount: form.paymentAmount
        });

        await submitJob(ipfsResult.bytes32, BigInt(form.computeUnits), form.paymentAmount);
        setStep("confirming");
      } catch (err) {
        console.error("Submit error:", err);
        setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
        setStep("error");
      }
    },
    [form, isConnected, address, uploadSpec, uploadFile, uploadedFile, submitJob, freeTxCount]
  );

  // Track tx confirmation
  React.useEffect(() => {
    if (isSuccess) setStep("success");
  }, [isSuccess]);

  React.useEffect(() => {
    if (txError) {
      setErrorMsg(txError.message);
      setStep("error");
    }
  }, [txError]);

  // ── Compute units → human time ──
  const computeTimeLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b-[3px] border-purple-500 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-4 md:px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Hyperway
              <span className="ml-2 text-[10px] font-mono text-purple-400 border border-purple-500 rounded px-1.5 py-0.5 uppercase">
                Beta
              </span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                if (!mounted) return null;
                if (!account || !chain) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="neo-btn neo-btn-sm bg-purple-600 text-white"
                    >
                      Connect
                    </button>
                  );
                }
                return (
                  <button
                    onClick={openAccountModal}
                    className="neo-btn neo-btn-sm bg-[#1a1a1a] text-purple-300 border-purple-500"
                  >
                    {account.displayName}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Submit Compute Job
          </h2>
          <p className="text-gray-400 text-lg">
            Define your AI workload, upload specs to IPFS, and escrow payment on-chain.
          </p>
        </div>

        {/* ── Success State ── */}
        {step === "success" && (
          <div className="neo-card border-green-500 bg-green-500/10 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-1">Job Submitted!</h3>
                <p className="text-gray-300 mb-3">
                  Your compute job has been submitted and payment escrowed on-chain.
                </p>
                {hash && (
                  <a
                    href={`https://blockscout-testnet.polkadot.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline text-sm font-mono break-all"
                  >
                    View on Blockscout →
                  </a>
                )}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => { setStep("form"); setForm(initialForm); setUploadedFile(null); resetIPFS(); }}
                    className="neo-btn bg-purple-600 text-white"
                  >
                    Submit Another
                  </button>
                  <Link href="/dashboard" className="neo-btn bg-[#1a1a1a] text-gray-300">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Error Banner ── */}
        {(errorMsg || ipfsError) && (
          <div className="neo-card border-red-500 bg-red-500/10 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-400">Error</h3>
                <p className="text-gray-300 text-sm mt-1">{errorMsg || ipfsError}</p>
                <button
                  onClick={() => { setErrorMsg(null); setStep("form"); }}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Progress Steps ── */}
        {step !== "form" && step !== "success" && step !== "error" && (
          <div className="neo-card border-purple-500 bg-purple-500/5 mb-8">
            <div className="flex items-center gap-6">
              <StepIndicator label="Upload" active={step === "uploading"} done={step !== "uploading"} />
              <div className="h-px flex-1 bg-purple-800" />
              <StepIndicator label="Sign" active={step === "signing"} done={step === "confirming"} />
              <div className="h-px flex-1 bg-purple-800" />
              <StepIndicator label="Confirm" active={step === "confirming"} done={false} />
            </div>
          </div>
        )}

        {/* ── Form ── */}
        {(step === "form" || step === "error") && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left Column: Job Details ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Info Card */}
              <div className="neo-card">
                <h3 className="neo-section-title">Job Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="neo-label">Job Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. SDXL Image Generation"
                      className="neo-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="neo-label">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Describe what this compute job does..."
                      rows={3}
                      className="neo-input resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="neo-label">Model *</label>
                      <input
                        type="text"
                        value={form.model}
                        onChange={(e) => updateField("model", e.target.value)}
                        placeholder="e.g. stabilityai/sdxl-turbo"
                        className="neo-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="neo-label">Framework</label>
                      <select
                        value={form.framework}
                        onChange={(e) => updateField("framework", e.target.value as any)}
                        className="neo-input"
                      >
                        {FRAMEWORKS.map((fw) => (
                          <option key={fw} value={fw}>{fw}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="neo-card">
                <h3 className="neo-section-title">Hardware Requirements</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="neo-label">Min VRAM (GB)</label>
                    <input
                      type="number"
                      value={form.minVRAM}
                      onChange={(e) => updateField("minVRAM", Number(e.target.value))}
                      min={1}
                      max={80}
                      className="neo-input"
                    />
                  </div>
                  <div>
                    <label className="neo-label">
                      Compute Units (sec)
                      <span className="ml-2 text-xs text-purple-400 font-normal">
                        ≈ {computeTimeLabel(form.computeUnits)}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={form.computeUnits}
                      onChange={(e) => updateField("computeUnits", Number(e.target.value))}
                      min={60}
                      step={60}
                      className="neo-input"
                    />
                  </div>
                  <div>
                    <label className="neo-label">Preferred GPU</label>
                    <select
                      value={form.preferredGPU}
                      onChange={(e) => updateField("preferredGPU", e.target.value)}
                      className="neo-input"
                    >
                      {GPU_OPTIONS.map((gpu) => (
                        <option key={gpu} value={gpu}>{gpu}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Parameters Card */}
              <div className="neo-card">
                <h3 className="neo-section-title">Parameters (JSON)</h3>
                <textarea
                  value={form.parameters}
                  onChange={(e) => updateField("parameters", e.target.value)}
                  rows={5}
                  className="neo-input font-mono text-sm resize-none"
                  spellCheck={false}
                />
              </div>

              {/* File Upload Card */}
              <div className="neo-card">
                <h3 className="neo-section-title">Input Data (Optional)</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Upload a dataset, prompts file, or any input your model needs. Stored on IPFS.
                </p>

                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-[3px] border-dashed border-purple-700 rounded-xl bg-purple-500/5 cursor-pointer hover:bg-purple-500/10 hover:border-purple-500 transition-all group">
                    <div className="text-center">
                      <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📁</span>
                      <span className="text-sm text-gray-400 group-hover:text-purple-300">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-600 block mt-1">Max 100 MB</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 border-[3px] border-purple-700 rounded-xl bg-purple-500/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 text-sm font-bold"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column: Payment & Submit ── */}
            <div className="space-y-6">
              {/* Payment Card */}
              <div className="neo-card border-purple-500">
                <h3 className="neo-section-title">Payment</h3>

                <div className="space-y-4">
                  <div>
                    <label className="neo-label">Amount (PAS)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.paymentAmount}
                        onChange={(e) => updateField("paymentAmount", e.target.value)}
                        min="0.001"
                        step="0.01"
                        className="neo-input pr-14"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 font-mono text-sm">
                        PAS
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Escrowed on-chain until job completes
                    </p>
                  </div>

                  {/* XCM Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#111] border-[2px] border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔗</span>
                      <div>
                        <p className="text-sm font-semibold text-white">XCM Payment</p>
                        <p className="text-xs text-gray-500">Pay from another parachain</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("useXCM", !form.useXCM)}
                      className={`neo-toggle ${form.useXCM ? "neo-toggle-on" : ""}`}
                    >
                      <div className="neo-toggle-dot" />
                    </button>
                  </div>

                  {form.useXCM && (
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-800 text-xs text-purple-300">
                      <p className="font-semibold mb-1">⚡ Cross-chain transfer</p>
                      <p className="text-gray-400">
                        Funds will be transferred via XCM from Asset Hub to Polkadot Hub
                        and escrowed in the marketplace contract.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gasless Toggle Card */}
              <div className="neo-card border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="neo-section-title !mb-0">Gasless Mode ⚡</h3>
                  <button
                    type="button"
                    onClick={() => updateField("useGasless", !form.useGasless)}
                    className={`neo-toggle ${form.useGasless ? "neo-toggle-on" : ""}`}
                  >
                    <div className="neo-toggle-dot" />
                  </button>
                </div>

                {form.useGasless ? (
                  <div className="space-y-3">
                    <p className="text-sm text-purple-300">
                      Sign a message instead of paying gas. We relay your transaction for free!
                    </p>
                    {/* Free Transaction Counter */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-600/10 border border-purple-700">
                      <div className="flex gap-1">
                        {Array.from({ length: MAX_FREE_TXS }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-sm border-2 transition-all ${
                              i < freeTxCount
                                ? "bg-purple-500 border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                                : "bg-gray-800 border-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        <span className="text-purple-300 font-bold">{freeTxCount}</span> of {MAX_FREE_TXS} free
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    You&apos;ll pay gas directly from your wallet.
                  </p>
                )}
              </div>

              {/* Summary Card */}
              <div className="neo-card bg-[#0f0f0f] border-purple-600">
                <h3 className="neo-section-title">Summary</h3>
                <div className="space-y-2 text-sm">
                  <SummaryRow label="Compute" value={computeTimeLabel(form.computeUnits)} />
                  <SummaryRow label="Payment" value={`${form.paymentAmount} PAS`} accent />
                  <SummaryRow label="Min VRAM" value={`${form.minVRAM} GB`} />
                  <SummaryRow label="GPU" value={form.preferredGPU} />
                  <SummaryRow label="Gas" value={form.useGasless ? "Free ⚡" : "User pays"} />
                  <SummaryRow label="Payment via" value={form.useXCM ? "XCM 🔗" : "Direct"} />
                  {uploadedFile && (
                    <SummaryRow label="Input file" value={uploadedFile.name} />
                  )}
                </div>
                <div className="h-px bg-purple-800 my-4" />

                {/* Submit Button */}
                {!isConnected ? (
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => {
                      if (!mounted) return null;
                      return (
                        <button
                          type="button"
                          onClick={openConnectModal}
                          className="neo-btn w-full bg-purple-600 text-white text-base py-3"
                        >
                          Connect Wallet to Submit
                        </button>
                      );
                    }}
                  </ConnectButton.Custom>
                ) : (
                  <button
                    type="submit"
                    disabled={isPending || isConfirming || isUploading || isUploadingFile}
                    className="neo-btn w-full bg-purple-600 text-white text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading || isUploadingFile
                      ? "Uploading to IPFS..."
                      : isPending
                        ? "Confirm in wallet..."
                        : isConfirming
                          ? "Confirming on-chain..."
                          : form.useGasless
                            ? "Sign & Submit (Gasless) ⚡"
                            : "Submit Job"}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </main>

      {/* ── Inline Styles for Neo-Brutalist Theme ── */}
      <style jsx global>{`
        /* ── Neo-Brutalist Card ── */
        .neo-card {
          background: #111111;
          border: 3px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 6px 6px 0px #1a1a1a;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .neo-card:hover {
          box-shadow: 4px 4px 0px #1a1a1a;
          transform: translate(1px, 1px);
        }

        /* ── Section Title ── */
        .neo-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #e2e2e2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        /* ── Label ── */
        .neo-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #888;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* ── Input ── */
        .neo-input {
          width: 100%;
          background: #0a0a0a;
          border: 3px solid #2a2a2a;
          border-radius: 12px;
          padding: 10px 14px;
          color: #e2e2e2;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .neo-input:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.15);
        }
        .neo-input::placeholder {
          color: #444;
        }
        .neo-input option {
          background: #111;
          color: #e2e2e2;
        }

        /* ── Button ── */
        .neo-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 3px solid currentColor;
          border-radius: 12px;
          padding: 8px 20px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.4);
          transition: all 0.1s ease;
          text-decoration: none;
        }
        .neo-btn:hover:not(:disabled) {
          box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
          transform: translate(2px, 2px);
        }
        .neo-btn:active:not(:disabled) {
          box-shadow: 0px 0px 0px rgba(0,0,0,0.4);
          transform: translate(4px, 4px);
        }
        .neo-btn-sm {
          padding: 4px 14px;
          font-size: 13px;
          border-width: 2px;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
        }

        /* ── Toggle ── */
        .neo-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: #2a2a2a;
          border: 2px solid #444;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .neo-toggle-on {
          background: #7c3aed;
          border-color: #9333ea;
        }
        .neo-toggle-dot {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #888;
          border-radius: 999px;
          transition: all 0.2s ease;
        }
        .neo-toggle-on .neo-toggle-dot {
          transform: translateX(20px);
          background: white;
          box-shadow: 0 0 8px rgba(147, 51, 234, 0.6);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-lg border-[3px] flex items-center justify-center text-xs font-bold transition-all ${
          active
            ? "border-purple-500 bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)] animate-pulse"
            : done
              ? "border-green-500 bg-green-600/20 text-green-400"
              : "border-gray-700 bg-gray-800 text-gray-500"
        }`}
      >
        {done && !active ? "✓" : active ? "⋯" : "○"}
      </div>
      <span className={`text-sm font-semibold ${active ? "text-purple-300" : done ? "text-green-400" : "text-gray-600"}`}>
        {label}
      </span>
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className={accent ? "text-purple-300 font-bold" : "text-gray-300 font-medium"}>
        {value}
      </span>
    </div>
  );
}
