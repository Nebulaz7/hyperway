"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useRealtimeBuyerJobs,
  useRealtimeProviderJobs,
} from "@/hooks/useRealtimeJobs";
import { useIsProvider } from "@/hooks/useMarketplace";
import Blockie from "@/app/components/Blockie";
import type { Database } from "@/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = Database["public"]["Enums"]["job_status"];

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

function weiToPAS(wei: number | string): string {
  const num = typeof wei === "string" ? Number(wei) : wei;
  return (num / 1e18).toFixed(num / 1e18 >= 1 ? 2 : 4);
}

export default function MyJobsPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"BUYER" | "PROVIDER">("BUYER");

  const { data: isProviderData } = useIsProvider(
    address as `0x${string}` | undefined,
  );

  const { jobs: buyerJobs, loading: buyerLoading } =
    useRealtimeBuyerJobs(address);
  const { jobs: providerJobs, loading: providerLoading } =
    useRealtimeProviderJobs(address);

  const displayedJobs = activeTab === "BUYER" ? buyerJobs : providerJobs;
  const isLoading = activeTab === "BUYER" ? buyerLoading : providerLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* No local header, using global Navbar from layout */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
              My Jobs
            </h2>
            <p className="text-gray-500">
              Track jobs you have submitted or claimed.
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="neo-card text-center py-16">
            <span className="text-5xl block mb-4">🔗</span>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              Connect Wallet Required
            </h3>
            <p className="text-gray-500 mb-6">
              Please connect your wallet to view your jobs.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b-2 border-gray-800 pb-4">
              <button
                onClick={() => setActiveTab("BUYER")}
                className={`neo-btn ${activeTab === "BUYER" ? "bg-purple-600 text-white" : "bg-transparent text-gray-400 border-gray-700"}`}
              >
                Submitted by Me ({buyerJobs.length})
              </button>
              {!!isProviderData && (
                <button
                  onClick={() => setActiveTab("PROVIDER")}
                  className={`neo-btn ${activeTab === "PROVIDER" ? "bg-blue-600 text-white" : "bg-transparent text-gray-400 border-gray-700"}`}
                >
                  Claimed by Me ({providerJobs.length})
                </button>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Loading your jobs...</p>
              </div>
            ) : displayedJobs.length === 0 ? (
              <div className="neo-card text-center py-16">
                <span className="text-5xl block mb-4">📭</span>
                <h3 className="text-xl font-bold text-gray-300 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "BUYER"
                    ? "You haven't submitted any compute jobs yet."
                    : "You haven't claimed any jobs as a provider yet."}
                </p>
                {activeTab === "BUYER" && (
                  <Link
                    href="/submit-job"
                    className="neo-btn bg-purple-600 text-white"
                  >
                    + Submit a Job
                  </Link>
                )}
                {activeTab === "PROVIDER" && (
                  <Link
                    href="/marketplace"
                    className="neo-btn bg-blue-600 text-white"
                  >
                    Browse Marketplace
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedJobs.map((job) => (
                  <JobCard key={job.job_id} job={job} viewType={activeTab} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

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
      `}</style>
    </div>
  );
}

function JobCard({
  job,
  viewType,
}: {
  job: JobRow;
  viewType: "BUYER" | "PROVIDER";
}) {
  const cfg = STATUS_CONFIG[job.status];

  // Handle schema fallback
  const validBuyer = (job as any).buyer_address || (job as any).buyer || "";
  const validProvider =
    (job as any).provider_address || (job as any).provider || "";
  const validComputeUnits = (job as any).compute_units || 3600;

  return (
    <div className="neo-card flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Blockie address={validBuyer} size={36} />
          <div>
            <p className="text-sm font-bold text-white">Job #{job.job_id}</p>
            <p className="text-[10px] text-gray-500 uppercase">
              {timeAgo(job.created_at)}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border-2 ${cfg.bg} ${cfg.color}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${cfg.dot} ${job.status === "PENDING" ? "animate-pulse" : ""}`}
          />
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
        <div className="p-2.5 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
          <p className="text-[10px] text-gray-600 uppercase font-bold mb-0.5">
            Payment
          </p>
          <p className="text-sm font-bold text-purple-300">
            {weiToPAS(job.payment_amount)} PAS
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
          <p className="text-[10px] text-gray-600 uppercase font-bold mb-0.5">
            Compute
          </p>
          <p className="text-sm font-bold text-gray-300">
            {computeTimeLabel(validComputeUnits)}
          </p>
        </div>
      </div>

      {viewType === "BUYER" && validProvider && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-500/5 border-2 border-gray-800 mb-4">
          <Blockie address={validProvider} size={20} />
          <span className="text-xs text-gray-400 font-medium">
            Provider: {truncateAddress(validProvider)}
          </span>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-auto pt-2 space-y-2">
        {job.status === "COMPLETED" && job.result_cid && (
          <a
            href={`https://cyan-elaborate-blackbird-542.mypinata.cloud/ipfs/${job.result_cid}`}
            target="_blank"
            rel="noreferrer"
            className="neo-btn w-full bg-green-600 text-white text-sm py-2"
          >
            📥 Download Result
          </a>
        )}

        {viewType === "PROVIDER" && job.status === "ASSIGNED" && (
          <Link
            href={`/dashboard?jobId=${job.job_id}`}
            className="neo-btn w-full bg-blue-600 text-white text-sm py-2"
          >
            📤 Submit Proof
          </Link>
        )}

        <Link
          href={`/marketplace/${job.job_id}`}
          className="neo-btn w-full bg-[#1a1a1a] text-gray-300 text-sm py-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
