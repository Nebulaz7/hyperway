"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Blockie from "@/app/components/Blockie";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRealtimeJobs, useRealtimeStats } from "@/hooks/useRealtimeJobs";
import { useAssignJob, useIsProvider } from "@/hooks/useMarketplace";
import type { Database } from "@/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = Database["public"]["Enums"]["job_status"];

// ─────────────────────────────────────────────
//  Filter State
// ─────────────────────────────────────────────

interface Filters {
  status: JobStatus | "ALL";
  minPayment: string;
  maxComputeUnits: string;
  sortBy: "newest" | "payment_high" | "payment_low" | "compute_low";
}

const defaultFilters: Filters = {
  status: "ALL",
  minPayment: "",
  maxComputeUnits: "",
  sortBy: "newest",
};

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

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

function StatusBadge({ status }: { status: JobStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border-2 ${cfg.bg} ${cfg.color}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${cfg.dot} ${status === "PENDING" ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  );
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

function weiToPAS(wei: number): string {
  return (wei / 1e18).toFixed(wei / 1e18 >= 1 ? 2 : 4);
}

// ─────────────────────────────────────────────
//  Page Component
// ─────────────────────────────────────────────

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const { jobs, loading } = useRealtimeJobs();
  const { stats } = useRealtimeStats();
  const { data: isProviderData } = useIsProvider(
    address as `0x${string}` | undefined,
  );
  const {
    assignJob,
    isPending: isClaiming,
    hash: claimHash,
    isSuccess: claimSuccess,
  } = useAssignJob();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [claimingJobId, setClaimingJobId] = useState<number | null>(null);
  const [newJobFlash, setNewJobFlash] = useState<number | null>(null);
  const prevJobCount = useRef(0);

  // Flash effect on new job
  useEffect(() => {
    if (jobs.length > prevJobCount.current && prevJobCount.current > 0) {
      setNewJobFlash(jobs[0]?.job_id ?? null);
      const t = setTimeout(() => setNewJobFlash(null), 2000);
      return () => clearTimeout(t);
    }
    prevJobCount.current = jobs.length;
  }, [jobs.length, jobs]);

  // Reset claim state on success
  useEffect(() => {
    if (claimSuccess) {
      setTimeout(() => setClaimingJobId(null), 1500);
    }
  }, [claimSuccess]);

  // ── Filter + Sort ──

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Status filter
    if (filters.status !== "ALL") {
      result = result.filter((j) => j.status === filters.status);
    }

    // Min payment
    if (filters.minPayment) {
      const min = Number(filters.minPayment) * 1e18;
      result = result.filter((j) => j.payment_amount >= min);
    }

    // Max compute units
    if (filters.maxComputeUnits) {
      const max = Number(filters.maxComputeUnits);
      result = result.filter((j) => j.compute_units <= max);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "payment_high":
        result.sort((a, b) => b.payment_amount - a.payment_amount);
        break;
      case "payment_low":
        result.sort((a, b) => a.payment_amount - b.payment_amount);
        break;
      case "compute_low":
        result.sort((a, b) => a.compute_units - b.compute_units);
        break;
    }

    return result;
  }, [jobs, filters]);

  const handleClaim = (jobId: number) => {
    if (!isConnected) return;
    setClaimingJobId(jobId);
    assignJob(BigInt(jobId));
  };

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* No local header, using global Navbar from layout */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* ── Header + Stats ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Marketplace
            </h2>
            <p className="text-gray-500">
              Browse open compute jobs or claim work as a provider.
            </p>
          </div>

          {/* Live stats bar */}
          {stats && (
            <div className="flex gap-4">
              <StatPill
                label="Active Jobs"
                value={String(stats.total_jobs - stats.completed_jobs)}
              />
              <StatPill
                label="Providers"
                value={String(stats.provider_count)}
              />
              <StatPill
                label="Total Volume"
                value={`${weiToPAS(stats.total_volume_wei)} PAS`}
              />
            </div>
          )}
        </div>

        {/* ── Filter + Sort ── */}
        <div className="neo-card mb-6 !p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex gap-1 bg-[#0a0a0a] rounded-xl p-1 border-2 border-gray-800">
              {(
                [
                  "ALL",
                  "PENDING",
                  "ASSIGNED",
                  "COMPLETED",
                  "FAILED",
                  "DISPUTED",
                ] as const
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters((f) => ({ ...f, status: s }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filters.status === s
                      ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(147,51,234,0.3)]"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sortBy: e.target.value as Filters["sortBy"],
                }))
              }
              className="neo-input !w-auto !py-1.5 !px-3 text-xs"
            >
              <option value="newest">Newest First</option>
              <option value="payment_high">Highest Pay</option>
              <option value="payment_low">Lowest Pay</option>
              <option value="compute_low">Fastest Jobs</option>
            </select>

            {/* Toggle extra filters */}
            <button
              onClick={() => setShowFilters((f) => !f)}
              className={`neo-btn neo-btn-sm ${showFilters ? "bg-purple-600 text-white" : "bg-[#1a1a1a] text-gray-400"}`}
            >
              ⚙ Filters
            </button>

            {/* Job count */}
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                • Live
              </span>
            </div>
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t-2 border-gray-800">
              <div>
                <label className="neo-label !text-xs">Min Payment (PAS)</label>
                <input
                  type="number"
                  value={filters.minPayment}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, minPayment: e.target.value }))
                  }
                  placeholder="0"
                  step="0.01"
                  className="neo-input !w-32 !py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="neo-label !text-xs">Max Compute (sec)</label>
                <input
                  type="number"
                  value={filters.maxComputeUnits}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      maxComputeUnits: e.target.value,
                    }))
                  }
                  placeholder="∞"
                  className="neo-input !w-32 !py-1.5 text-xs"
                />
              </div>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-xs text-purple-400 hover:text-purple-300 underline self-end mb-1"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* ── Provider Banner ── */}
        {isConnected && !!isProviderData && (
          <div className="neo-card border-purple-500 bg-purple-500/5 !p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              <div>
                <p className="text-sm font-bold text-purple-300">
                  Provider Mode Active
                </p>
                <p className="text-xs text-gray-500">
                  You can claim PENDING jobs below. Click &quot;Claim Job&quot;
                  to assign yourself.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Job Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="neo-card text-center py-16">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.status !== "ALL"
                ? `No ${STATUS_CONFIG[filters.status as JobStatus]?.label.toLowerCase()} jobs right now.`
                : "The marketplace is empty. Be the first to submit a job!"}
            </p>
            <Link
              href="/submit-job"
              className="neo-btn bg-purple-600 text-white"
            >
              + Submit a Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <Link key={job.job_id} href={`/marketplace/${job.job_id}`} className="block">
                <JobCard
                  job={job}
                  isProvider={!!isProviderData}
                  isConnected={isConnected}
                  userAddress={address}
                  isClaiming={isClaiming && claimingJobId === job.job_id}
                  claimSuccess={claimSuccess && claimingJobId === job.job_id}
                  onClaim={handleClaim}
                  isNew={newJobFlash === job.job_id}
                />
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── Neo-Brutalist Styles (reuse from submit-job) ── */}
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
        .neo-card:hover {
          box-shadow: 4px 4px 0px #1a1a1a;
          transform: translate(1px, 1px);
        }
        .neo-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #e2e2e2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .neo-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #888;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .neo-input {
          width: 100%;
          background: #0a0a0a;
          border: 3px solid #2a2a2a;
          border-radius: 12px;
          padding: 10px 14px;
          color: #e2e2e2;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
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
        @keyframes flashIn {
          0% {
            box-shadow:
              0 0 0 0 rgba(147, 51, 234, 0.6),
              6px 6px 0px #1a1a1a;
          }
          50% {
            box-shadow:
              0 0 20px 4px rgba(147, 51, 234, 0.3),
              6px 6px 0px #1a1a1a;
          }
          100% {
            box-shadow:
              0 0 0 0 rgba(147, 51, 234, 0),
              6px 6px 0px #1a1a1a;
          }
        }
        .neo-flash {
          animation: flashIn 1s ease-out;
          border-color: #9333ea !important;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border-2 border-gray-800 rounded-xl">
      <span className="text-xs text-gray-500 hidden md:inline">{label}</span>
      <span className="text-sm font-bold text-purple-300">{value}</span>
    </div>
  );
}

function JobCard({
  job,
  isProvider,
  isConnected,
  userAddress,
  isClaiming,
  claimSuccess,
  onClaim,
  isNew,
}: {
  job: JobRow;
  isProvider: boolean;
  isConnected: boolean;
  userAddress: string | undefined;
  isClaiming: boolean;
  claimSuccess: boolean;
  onClaim: (jobId: number) => void;
  isNew: boolean;
}) {
  const validBuyer = (job as any).buyer_address || (job as any).buyer || "";
  const validProvider = (job as any).provider_address || (job as any).provider || "";

  const isBuyer =
    userAddress && validBuyer.toLowerCase() === userAddress.toLowerCase();
  const isAssignedToMe =
    userAddress && validProvider.toLowerCase() === userAddress.toLowerCase();
  const canClaim = isProvider && job.status === "PENDING" && !isBuyer;

  return (
    <div className={`neo-card flex flex-col ${isNew ? "neo-flash" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Blockie address={validBuyer} size={36} />
          <div>
            <p className="text-sm font-bold text-white">Job #{job.job_id}</p>
            <p className="text-xs text-gray-500">
              {truncateAddress(validBuyer)}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Spec CID */}
      <div className="mb-4 p-3 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
        <p className="text-[10px] text-gray-600 uppercase font-bold mb-1">
          Spec CID
        </p>
        <p className="text-xs text-gray-400 font-mono break-all leading-relaxed">
          {job.spec_cid.slice(0, 16)}…{job.spec_cid.slice(-8)}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
        <DetailCell
          label="Payment"
          value={`${weiToPAS(job.payment_amount)} PAS`}
          accent
        />
        <DetailCell
          label="Compute"
          value={computeTimeLabel((job as any).compute_units || 3600)}
        />
        <DetailCell label="Posted" value={timeAgo(job.created_at)} />
        <DetailCell
          label="Type"
          value={(job as any).is_xcm_payment ? "XCM 🔗" : "Direct"}
        />
      </div>

      {/* Provider info (if assigned) */}
      {validProvider && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/5 border-2 border-blue-800 mb-4">
          <Blockie address={validProvider} size={20} />
          <span className="text-xs text-blue-300 font-medium">
            {isAssignedToMe
              ? "Assigned to you"
              : `Provider: ${truncateAddress(validProvider)}`}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-2">
        {canClaim && (
          <button
            onClick={() => onClaim(job.job_id)}
            disabled={isClaiming}
            className="neo-btn w-full bg-purple-600 text-white text-sm py-2"
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

        {isBuyer && job.status === "PENDING" && (
          <span className="block text-center text-xs text-gray-500 py-2">
            Your job — waiting for a provider
          </span>
        )}

        {isAssignedToMe && job.status === "ASSIGNED" && (
          <Link
            href={`/dashboard?jobId=${job.job_id}`}
            className="neo-btn w-full bg-blue-600 text-white text-sm py-2"
          >
            📤 Submit Proof
          </Link>
        )}

        {!isConnected && job.status === "PENDING" && (
          <span className="block text-center text-xs text-gray-500 py-2">
            Connect wallet to claim
          </span>
        )}
      </div>
    </div>
  );
}

function DetailCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="p-2.5 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
      <p className="text-[10px] text-gray-600 uppercase font-bold mb-0.5">
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
