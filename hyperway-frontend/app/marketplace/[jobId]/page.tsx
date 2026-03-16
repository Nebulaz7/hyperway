"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAssignJob, useIsProvider } from "@/hooks/useMarketplace";
import { supabase } from "@/config/supabase";
import type { Database } from "@/database.types";
import Blockie from "@/app/components/Blockie";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = Database["public"]["Enums"]["job_status"];

// ─────────────────────────────────────────────
//  Status helpers
// ─────────────────────────────────────────────

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Open",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-600",
    dot: "bg-yellow-400",
  },
  ASSIGNED: {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-600",
    dot: "bg-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-600",
    dot: "bg-green-400",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-600",
    dot: "bg-red-400",
  },
  DISPUTED: {
    label: "Disputed",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-600",
    dot: "bg-orange-400",
  },
};

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function weiToPAS(wei: number): string {
  return (wei / 1e18).toFixed(wei / 1e18 >= 1 ? 2 : 4);
}

function computeTimeLabel(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─────────────────────────────────────────────
//  Page Component
// ─────────────────────────────────────────────

export default function JobDetailPage() {
  const params = useParams();
  const jobId = Number(params.jobId);

  const { address, isConnected } = useAccount();
  const { data: isProviderData } = useIsProvider(
    address as `0x${string}` | undefined,
  );
  const {
    assignJob,
    isPending: isClaiming,
    isSuccess: claimSuccess,
  } = useAssignJob();

  const [job, setJob] = useState<JobRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job + subscribe to realtime updates
  useEffect(() => {
    if (isNaN(jobId)) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      const { data, error: fetchErr } = await supabase
        .from("jobs")
        .select("*")
        .eq("job_id", jobId)
        .single();

      if (fetchErr || !data) {
        setError("Job not found");
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();

    // Subscribe to realtime updates for this job
    const channel = supabase
      .channel(`job-detail-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          setJob(payload.new as JobRow);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  const handleClaim = () => {
    if (!isConnected) return;
    assignJob(BigInt(jobId));
  };

  const validBuyer = (job as any)?.buyer_address || (job as any)?.buyer || "";
  const validProvider = (job as any)?.provider_address || (job as any)?.provider || "";

  const isBuyer =
    address && validBuyer.toLowerCase() === address.toLowerCase();
  const isAssignedToMe =
    address && validProvider.toLowerCase() === address.toLowerCase();
  const canClaim =
    !!isProviderData && job?.status === "PENDING" && !isBuyer;

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* No local header, using global Navbar from layout */}

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading job details...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="neo-card text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-gray-300 mb-2">{error}</h3>
            <p className="text-gray-500 mb-6">
              This job may not exist or has been removed.
            </p>
            <Link
              href="/marketplace"
              className="neo-btn bg-purple-600 text-white"
            >
              ← Back to Marketplace
            </Link>
          </div>
        )}

        {/* Job Details */}
        {job && !loading && !error && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Blockie address={validBuyer} size={48} />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Job #{job.job_id}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Posted by {truncateAddress(validBuyer)} · {timeAgo(job.created_at)}
                  </p>
                </div>
              </div>
              <StatusBadgeLarge status={job.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Left Column: Details ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Spec CID */}
                <div className="neo-card">
                  <h3 className="neo-section-title">Specification</h3>
                  <div className="p-4 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
                    <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">
                      Spec CID (IPFS)
                    </p>
                    <p className="text-sm text-gray-300 font-mono break-all leading-relaxed">
                      {job.spec_cid}
                    </p>
                  </div>

                  {job.result_cid && (
                    <div className="p-4 rounded-xl bg-[#0a0a0a] border-2 border-green-800 mt-4">
                      <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">
                        Result CID (IPFS)
                      </p>
                      <p className="text-sm text-green-300 font-mono break-all leading-relaxed">
                        {job.result_cid}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="neo-card">
                  <h3 className="neo-section-title">Job Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MetricCell
                      label="Payment"
                      value={`${weiToPAS(job.payment_amount)} PAS`}
                      accent
                    />
                    <MetricCell
                      label="Compute Time"
                      value={computeTimeLabel((job as any).compute_units || 3600)}
                    />
                    <MetricCell
                      label="Payment Type"
                      value={(job as any).is_xcm_payment ? "XCM 🔗" : "Direct"}
                    />
                    <MetricCell
                      label="Created"
                      value={formatDate(job.created_at)}
                    />
                    <MetricCell
                      label="Assigned"
                      value={formatDate(job.assigned_at)}
                    />
                    <MetricCell
                      label="Completed"
                      value={formatDate(job.completed_at)}
                    />
                  </div>
                </div>

                {/* Buyer info */}
                <div className="neo-card">
                  <h3 className="neo-section-title">Buyer</h3>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
                    <Blockie address={validBuyer} size={40} />
                    <div>
                      <p className="text-sm font-bold text-white font-mono">
                        {validBuyer}
                      </p>
                      {isBuyer && (
                        <span className="text-xs text-purple-400 font-semibold">
                          (You)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Provider info */}
                {validProvider && (
                  <div className="neo-card">
                    <h3 className="neo-section-title">Provider</h3>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/5 border-2 border-blue-800">
                      <Blockie address={validProvider} size={40} />
                      <div>
                        <p className="text-sm font-bold text-white font-mono">
                          {validProvider}
                        </p>
                        {isAssignedToMe && (
                          <span className="text-xs text-blue-400 font-semibold">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* On-chain info */}
                <div className="neo-card">
                  <h3 className="neo-section-title">On-Chain Data</h3>
                  <div className="space-y-3">
                    {job.created_tx_hash && (
                      <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
                        <span className="text-[10px] text-gray-600 uppercase font-bold">
                          Transaction Hash
                        </span>
                        <a
                          href={`https://blockscout-testnet.polkadot.io/tx/${job.created_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-400 hover:text-purple-300 font-mono break-all underline"
                        >
                          {job.created_tx_hash}
                        </a>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
                      <span className="text-[10px] text-gray-600 uppercase font-bold">
                        Block Number
                      </span>
                      <span className="text-sm text-gray-300 font-mono">
                        {job.created_block ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Column: Actions ── */}
              <div className="space-y-6">
                {/* Action Card */}
                <div className="neo-card border-purple-500 sticky top-24">
                  <h3 className="neo-section-title">Actions</h3>

                  {/* Claim Job */}
                  {canClaim && (
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-400">
                        This job is open for providers. Claim it to start
                        working.
                      </p>
                      {!isConnected ? (
                        <ConnectButton.Custom>
                          {({ openConnectModal, mounted }): React.ReactNode => {
                            if (!mounted) return null;
                            return (
                              <button
                                onClick={openConnectModal}
                                className="neo-btn w-full bg-purple-600 text-white text-sm py-2.5"
                              >
                                Connect Wallet to Claim
                              </button>
                            );
                          }}
                        </ConnectButton.Custom>
                      ) : (
                        <button
                          onClick={handleClaim}
                          disabled={isClaiming}
                          className="neo-btn w-full bg-purple-600 text-white text-sm py-2.5"
                        >
                          {isClaiming ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Claiming...
                            </>
                          ) : claimSuccess ? (
                            "✅ Claimed!"
                          ) : (
                            "⚡ Claim Job"
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Submit Proof */}
                  {isAssignedToMe && job.status === "ASSIGNED" && (
                    <Link
                      href={`/dashboard?jobId=${job.job_id}`}
                      className="neo-btn w-full bg-blue-600 text-white text-sm py-2.5 mb-4"
                    >
                      📤 Submit Proof
                    </Link>
                  )}

                  {/* Buyer waiting */}
                  {isBuyer && job.status === "PENDING" && (
                    <div className="p-4 rounded-xl bg-yellow-500/5 border-2 border-yellow-800 mb-4">
                      <p className="text-sm text-yellow-400 font-semibold mb-1">
                        ⏳ Waiting for Provider
                      </p>
                      <p className="text-xs text-gray-500">
                        Your job is listed on the marketplace. A provider will
                        claim it soon.
                      </p>
                    </div>
                  )}

                  {/* Not connected */}
                  {!isConnected && job.status === "PENDING" && (
                    <div className="p-4 rounded-xl bg-gray-500/5 border-2 border-gray-700">
                      <p className="text-sm text-gray-400">
                        Connect your wallet to claim this job as a provider.
                      </p>
                    </div>
                  )}

                  {/* Status message for completed/failed */}
                  {job.status === "COMPLETED" && (
                    <div className="p-4 rounded-xl bg-green-500/5 border-2 border-green-800">
                      <p className="text-sm text-green-400 font-semibold mb-1">
                        ✅ Job Completed
                      </p>
                      <p className="text-xs text-gray-500">
                        This job has been successfully completed and payment
                        released.
                      </p>
                    </div>
                  )}

                  {job.status === "FAILED" && (
                    <div className="p-4 rounded-xl bg-red-500/5 border-2 border-red-800">
                      <p className="text-sm text-red-400 font-semibold mb-1">
                        ❌ Job Failed
                      </p>
                      <p className="text-xs text-gray-500">
                        This job failed and was not completed successfully.
                      </p>
                    </div>
                  )}

                  {job.status === "DISPUTED" && (
                    <div className="p-4 rounded-xl bg-orange-500/5 border-2 border-orange-800">
                      <p className="text-sm text-orange-400 font-semibold mb-1">
                        ⚠️ Disputed
                      </p>
                      <p className="text-xs text-gray-500">
                        The buyer has disputed the result of this job.
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t-2 border-gray-800">
                    <div className="space-y-2 text-sm">
                      <SummaryRow
                        label="Payment"
                        value={`${weiToPAS(job.payment_amount)} PAS`}
                        accent
                      />
                      <SummaryRow
                        label="Compute"
                        value={computeTimeLabel((job as any).compute_units || 3600)}
                      />
                      <SummaryRow label="Status" value={STATUS_CONFIG[job.status].label} />
                      <SummaryRow
                        label="Type"
                        value={(job as any).is_xcm_payment ? "XCM 🔗" : "Direct"}
                      />
                    </div>
                  </div>
                </div>

                {/* Back button */}
                <Link
                  href="/marketplace"
                  className="neo-btn w-full bg-[#1a1a1a] text-gray-400 text-sm py-2.5"
                >
                  ← Back to Marketplace
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Neo-Brutalist Styles ── */}
      <style jsx global>{`
        .neo-card {
          background: #111111;
          border: 3px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 6px 6px 0px #1a1a1a;
          transition:
            box-shadow 0.15s ease,
            transform 0.15s ease;
        }
        .neo-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #e2e2e2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
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
          box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
          transition: all 0.1s ease;
          text-decoration: none;
        }
        .neo-btn:hover:not(:disabled) {
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
          transform: translate(2px, 2px);
        }
        .neo-btn:active:not(:disabled) {
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.4);
          transform: translate(4px, 4px);
        }
        .neo-btn-sm {
          padding: 4px 14px;
          font-size: 13px;
          border-width: 2px;
          box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.4);
        }
        .neo-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────

function StatusBadgeLarge({ status }: { status: JobStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border-[3px] ${cfg.bg} ${cfg.color}`}
    >
      <span
        className={`w-3 h-3 rounded-full ${cfg.dot} ${status === "PENDING" ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  );
}

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
      <p className="text-[10px] text-gray-600 uppercase font-bold mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-bold ${accent ? "text-purple-300" : "text-gray-300"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span
        className={
          accent ? "text-purple-300 font-bold" : "text-gray-300 font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
