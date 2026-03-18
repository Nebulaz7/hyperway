"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useProvider,
  useIsProvider,
  useRegisterProvider,
  useSubmitProof,
} from "@/hooks/useMarketplace";
import { supabase } from "@/config/supabase";
import type { Database } from "@/database.types";
import Blockie from "@/app/components/Blockie";
import DaemonStatusPanel from "@/app/components/DaemonStatusPanel";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

// Status config
const STATUS_CONFIG: Record<
  string,
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

// Utils
function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function weiToPAS(wei: number | undefined): string {
  if (wei === undefined) return "0.00";
  return (wei / 1e18).toFixed(wei / 1e18 >= 1 ? 2 : 4);
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

// ─────────────────────────────────────────────
//  Page Component
// ─────────────────────────────────────────────

export default function ProviderDashboardPage() {
  const { address, isConnected } = useAccount();

  // Wagmi Provider Data
  const { data: isProviderData, isLoading: isProviderLoading } = useIsProvider(
    address as `0x${string}` | undefined,
  );
  const { data: rawProviderData, isLoading: isProviderDataLoading } = useProvider(
    address as `0x${string}` | undefined,
  );
  // Cast the providerData tuple from the smart contract response (which is typed as unknown or empty object by Wagmi)
  // Tuple format from ABI: [address providerAddress, string gpuSpecs, uint256 stakedAmount, bool isActive, uint256 reputationScore, uint256 jobsCompleted, uint256 jobsFailed, uint256 registeredAt]
  const providerData = rawProviderData as unknown as readonly [string, string, bigint, boolean, bigint, bigint, bigint, bigint] | undefined;

  // Helpers to extract index fields
  const pStakedAmount = providerData?.[2];
  const pIsActive = providerData?.[3];
  const pReputationScore = providerData?.[4];

  // Wagmi Write Hooks
  const {
    registerProvider,
    isPending: isRegistering,
    isConfirming: isRegisterConfirming,
    isSuccess: registerSuccess,
  } = useRegisterProvider();
  
  const {
    submitProof,
    isPending: isSubmittingProof,
    isConfirming: isProofConfirming,
    isSuccess: proofSuccess,
  } = useSubmitProof();

  // Local State
  const [activeJobs, setActiveJobs] = useState<JobRow[]>([]);
  const [completedJobs, setCompletedJobs] = useState<JobRow[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Forms
  const [regSpecs, setRegSpecs] = useState('{"gpu":"RTX 4090"}');
  const [regStake, setRegStake] = useState("1.0");

  const [proofForms, setProofForms] = useState<
    Record<number, { resultCid: string; proofData: string }>
  >({});
  const [submittingJobId, setSubmittingJobId] = useState<number | null>(null);

  // ── 1. Fetch Jobs from Supabase ──
  useEffect(() => {
    if (!address) {
      setLoadingJobs(false);
      return;
    }

    const fetchMyJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider", address.toLowerCase())
        .order("created_at", { ascending: false });

      if (!error && data) {
        setActiveJobs(data.filter((j) => j.status === "ASSIGNED"));
        
        const completed = data.filter((j) => j.status === "COMPLETED");
        setCompletedJobs(completed);
        
        // Calculate earnings from completed jobs
        const earningsRaw = completed.reduce(
          (sum, job) => sum + (job.payment_amount || 0),
          0,
        );
        setTotalEarnings(earningsRaw);
      }
      setLoadingJobs(false);
    };

    fetchMyJobs();

    // Subscribe to realtime jobs assigned to this provider
    const channel = supabase
      .channel(`provider-dashboard-${address}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: `provider=eq.${address.toLowerCase()}`,
        },
        (payload) => {
          fetchMyJobs(); // Re-fetch all on change for simplicity
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  // ── 2. Registration Handler ──
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSpecs || !regStake) return;
    registerProvider(regSpecs, regStake);
  };

  // ── 3. Proof Submission Handler ──
  const handleSubmitProof = (jobId: number) => {
    const form = proofForms[jobId];
    if (!form?.resultCid || !form?.proofData) return;
    
    setSubmittingJobId(jobId);
    submitProof(BigInt(jobId), form.resultCid as `0x${string}`, form.proofData as `0x${string}`);
  };

  // Reset loading state on success
  useEffect(() => {
    if (proofSuccess) {
      setSubmittingJobId(null);
      // Clear specific form could be done here
    }
  }, [proofSuccess]);

  const updateProofForm = (jobId: number, field: "resultCid" | "proofData", value: string) => {
    setProofForms((prev) => ({
      ...prev,
      [jobId]: { ...(prev[jobId] || { resultCid: "", proofData: "" }), [field]: value },
    }));
  };

  const isLoading = isProviderLoading || isProviderDataLoading;

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* No local header, using global Navbar from layout */}

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {!isConnected ? (
          <div className="neo-card text-center py-16">
            <span className="text-5xl block mb-4">🔌</span>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              Connect to Provider Dashboard
            </h3>
            <p className="text-gray-500 mb-6">
              Connect your wallet to manage your provider nodes or register a new one.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading your profile...</p>
          </div>
        ) : isProviderData ? (
          /* ── REGISTERED PROVIDER VIEW ── */
          <>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Provider Dashboard
              </h2>
              <p className="text-gray-400">
                Manage your node, submit proofs, and track earnings.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="neo-card !p-5">
                <p className="text-[11px] text-gray-500 uppercase font-bold mb-1">
                  Reputation
                </p>
                <p className="text-2xl font-bold text-purple-300">
                  {pReputationScore ? Number(pReputationScore) : 0}
                </p>
              </div>
              <div className="neo-card !p-5">
                <p className="text-[11px] text-gray-500 uppercase font-bold mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {weiToPAS(totalEarnings)} PAS
                </p>
              </div>
              <div className="neo-card !p-5">
                <p className="text-[11px] text-gray-500 uppercase font-bold mb-1">
                  Stake Amount (PAS)
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">
                    {pStakedAmount ? weiToPAS(Number(pStakedAmount)) : "0.00"}
                  </p>
                  <button className="text-xs font-bold text-purple-400 hover:text-purple-300 underline">
                    Manage
                  </button>
                </div>
              </div>
              <div className="neo-card !p-5">
                <p className="text-[11px] text-gray-500 uppercase font-bold mb-1">
                  Network Status
                </p>
                <p className="text-2xl font-bold text-white">
                  {pIsActive ? (
                    <span className="text-green-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="text-red-400">Inactive</span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Active Jobs ── */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Active Assigned Jobs</h3>
                  <span className="bg-purple-600/20 text-purple-400 border border-purple-500 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {activeJobs.length}
                  </span>
                </div>

                {loadingJobs ? (
                  <p className="text-gray-500 text-sm">Loading jobs...</p>
                ) : activeJobs.length === 0 ? (
                  <div className="neo-card !p-10 border-dashed border-gray-800 text-center">
                    <p className="text-gray-500">No active jobs assigned to you.</p>
                    <Link
                      href="/marketplace"
                      className="text-purple-400 hover:text-purple-300 font-bold text-sm mt-3 inline-block underline"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <div key={job.job_id} className="neo-card !p-5 border-blue-900/40">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Link href={`/marketplace/${job.job_id}`}>
                              <h4 className="text-lg font-bold text-blue-300 hover:text-blue-200 transition-colors">
                                Job #{job.job_id}
                              </h4>
                            </Link>
                            <p className="text-sm text-gray-500">
                              Assigned {timeAgo(job.assigned_at as string)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">
                              {weiToPAS(job.payment_amount)} PAS
                            </p>
                          </div>
                        </div>

                        {/* Submit Proof Form */}
                        <div className="p-4 rounded-xl bg-[#0a0a0a] border-2 border-gray-800">
                          <p className="text-sm font-bold text-white mb-3">Submit Output Proof</p>
                          <div className="space-y-3">
                            <div>
                              <label className="neo-label !text-[10px]">Result CID (IPFS Hash)</label>
                              <input
                                type="text"
                                placeholder="Qm..."
                                value={proofForms[job.job_id]?.resultCid || ""}
                                onChange={(e) => updateProofForm(job.job_id, "resultCid", e.target.value)}
                                className="neo-input !py-1.5 !text-xs"
                              />
                            </div>
                            <div>
                              <label className="neo-label !text-[10px]">Compute Proof (Hex bytes)</label>
                              <input
                                type="text"
                                placeholder="0x..."
                                value={proofForms[job.job_id]?.proofData || ""}
                                onChange={(e) => updateProofForm(job.job_id, "proofData", e.target.value)}
                                className="neo-input !py-1.5 !text-xs"
                              />
                            </div>
                            <button
                              onClick={() => handleSubmitProof(job.job_id)}
                              disabled={isSubmittingProof && submittingJobId === job.job_id}
                              className="neo-btn neo-btn-sm w-full bg-blue-600 text-white mt-2"
                            >
                              {isSubmittingProof && submittingJobId === job.job_id
                                ? isProofConfirming ? "Confirming..." : "Signing..."
                                : "Submit Proof"}
                            </button>
                            {proofSuccess && submittingJobId === job.job_id && (
                              <p className="text-green-400 text-xs text-center mt-2 font-bold">
                                ✅ Proof Submitted!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Daemon Status + Completed History ── */}
              <div className="space-y-6">
                {/* Live Daemon Status */}
                <DaemonStatusPanel providerAddress={address!} />

                {/* ── Completed History ── */}
                <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">History</h3>
                  <span className="text-gray-500 text-sm">
                    {completedJobs.length} completed
                  </span>
                </div>

                <div className="space-y-4">
                  {completedJobs.slice(0, 5).map((job) => (
                    <div key={job.job_id} className="p-4 rounded-xl bg-[#111] border-2 border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/marketplace/${job.job_id}`}>
                          <p className="text-sm font-bold text-white hover:text-purple-300">
                            Job #{job.job_id}
                          </p>
                        </Link>
                        <span className="text-xs font-bold text-green-400">
                          +{weiToPAS(job.payment_amount)} PAS
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Completed {timeAgo(job.completed_at as string)}
                      </p>
                    </div>
                  ))}
                  {completedJobs.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No completed jobs yet.</p>
                  )}
                  {completedJobs.length > 5 && (
                    <p className="text-purple-400 hover:text-purple-300 text-xs font-bold text-center cursor-pointer">
                      View all {completedJobs.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          </>
        ) : (
          /* ── UNREGISTERED ENROLLMENT VIEW ── */
          <div className="max-w-xl mx-auto neo-card border-purple-500">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">💻</span>
              <h2 className="text-2xl font-bold text-white">Become a Provider</h2>
              <p className="text-gray-400 text-sm mt-2">
                Register your GPU compute node to start claiming jobs and earning PAS on the Hyperway network.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="neo-label">GPU Specifications (JSON)</label>
                <textarea
                  value={regSpecs}
                  onChange={(e) => setRegSpecs(e.target.value)}
                  className="neo-input font-mono text-xs"
                  rows={3}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This config will be hashed and stored on-chain.</p>
              </div>

              <div>
                <label className="neo-label">Initial Stake (PAS)</label>
                <input
                  type="number"
                  value={regStake}
                  onChange={(e) => setRegStake(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="neo-input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum stake is required to guarantee performance.</p>
              </div>

              <div className="pt-4 border-t-2 border-gray-800">
                <button
                  type="submit"
                  disabled={isRegistering || isRegisterConfirming}
                  className="neo-btn w-full bg-purple-600 text-white py-3 text-base"
                >
                  {isRegistering
                    ? "Confirm in wallet..."
                    : isRegisterConfirming
                      ? "Registering..."
                      : "Register as Provider"}
                </button>
              </div>
              
              {registerSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500 rounded-xl text-center">
                  <p className="text-green-400 text-sm font-bold">Successfully registered!</p>
                  <p className="text-gray-400 text-xs mt-1">Please refresh the page if it doesn't update automatically.</p>
                </div>
              )}
            </form>
          </div>
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
        .neo-card:hover {
          box-shadow: 4px 4px 0px #1a1a1a;
          transform: translate(1px, 1px);
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
