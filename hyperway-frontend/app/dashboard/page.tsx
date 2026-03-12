"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HYPERWAY_ABI } from "@/constants/abis";
import { HYPERWAY_CONTRACT_ADDRESS } from "@/constants";
import Blockie from "@/app/components/Blockie";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fetch PAS balance
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
  });

  // Contract reads for global platform stats
  const { data: fee, isLoading: isFeeLoading } = useReadContract({
    address: HYPERWAY_CONTRACT_ADDRESS as `0x${string}`,
    abi: HYPERWAY_ABI,
    functionName: "platformFeeBps",
  });

  const { data: totalProviders, isLoading: isProvidersLoading } =
    useReadContract({
      address: HYPERWAY_CONTRACT_ADDRESS as `0x${string}`,
      abi: HYPERWAY_ABI,
      functionName: "providerCount",
    });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b-[3px] border-purple-500 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Hyperway
              <span className="ml-2 text-[10px] font-mono text-purple-400 border border-purple-500 rounded px-1.5 py-0.5 uppercase">
                Beta
              </span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openConnectModal,
                openAccountModal,
                mounted,
              }) => {
                if (!mounted) return null;
                if (!account || !chain) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="neo-btn neo-btn-sm bg-[#1a1a1a] text-purple-300 border-purple-500"
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
                    <Blockie address={account.address} size={18} />
                    {account.displayName}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {!isConnected ? (
          <div className="neo-card text-center py-16">
            <span className="text-5xl block mb-4">🔗</span>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              Connect Wallet Required
            </h3>
            <p className="text-gray-500 mb-6">
              Please connect your wallet to view your dashboard.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Console Hub
              </h2>
              <p className="text-gray-400 text-lg">
                Your command center for Hyperway compute services. Manage jobs, nodes, and earnings.
              </p>
            </div>

            {/* Quick Analytics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {/* Balance */}
              <div className="neo-card !p-6 border-purple-500/50 bg-purple-500/5">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-lg">💰</span> Available Balance
                </h3>
                <div className="flex items-baseline gap-2 mt-4">
                  {isBalanceLoading ? (
                    <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="text-4xl font-black text-white">
                        {balance
                          ? parseFloat(balance.formatted).toFixed(2)
                          : "0.00"}
                      </span>
                      <span className="text-purple-400 font-bold uppercase text-xl">
                        {balance?.symbol || "PAS"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Providers on Network */}
              <div className="neo-card !p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-lg">🌐</span> Network Providers
                </h3>
                <div className="flex items-baseline gap-2 mt-4">
                  {isProvidersLoading ? (
                    <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <span className="text-4xl font-black text-white">
                      {totalProviders?.toString() ?? "0"}
                    </span>
                  )}
                </div>
              </div>

              {/* Platform Fee */}
              <div className="neo-card !p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-lg">⚙️</span> Protocol Fee
                </h3>
                <div className="flex items-baseline gap-2 mt-4">
                  {isFeeLoading ? (
                    <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="text-4xl font-black text-white">
                        {fee ? `${Number(fee) / 100}` : "0.0"}
                      </span>
                      <span className="text-gray-500 font-bold text-xl">%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-800 my-8" />

            <h3 className="text-xl font-bold text-white mb-6">Applications</h3>

            {/* Navigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submit Job Card */}
              <Link href="/submit-job" className="group block">
                <div className="neo-card h-full flex flex-col justify-between border-purple-500 hover:bg-purple-500/5 transition-all">
                  <div>
                    <div className="w-14 h-14 bg-purple-600/20 border-2 border-purple-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      🚀
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      Submit Job
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Define your AI workload, requirements, payload, and escrow payment. Broadcast tasks to decentralized GPU nodes seamlessly.
                    </p>
                  </div>
                  <div className="flex items-center text-purple-400 font-bold text-sm uppercase">
                    Launch compute <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Marketplace Card */}
              <Link href="/marketplace" className="group block">
                <div className="neo-card h-full flex flex-col justify-between hover:border-gray-500 transition-all">
                  <div>
                    <div className="w-14 h-14 bg-gray-600/20 border-2 border-gray-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      🛒
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      Marketplace
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Live orderbook of all network compute jobs. Filter by hardware requirements, discover open tasks, or monitor global supply and demand.
                    </p>
                  </div>
                  <div className="flex items-center text-gray-300 font-bold text-sm uppercase">
                    Browse market <span>→</span>
                  </div>
                </div>
              </Link>

              {/* My Jobs Card */}
              <Link href="/my-jobs" className="group block">
                <div className="neo-card h-full flex flex-col justify-between hover:border-blue-500 transition-all">
                  <div>
                    <div className="w-14 h-14 bg-blue-600/20 border-2 border-blue-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      📊
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      My Jobs
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Track execution status and logs for workloads you have deployed. Access output CID artifacts, download results and manage task assignments simultaneously.
                    </p>
                  </div>
                  <div className="flex items-center text-blue-400 font-bold text-sm uppercase">
                    View active tasks <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Provider Dashboard Card */}
              <Link href="/provider-dashboard" className="group block">
                <div className="neo-card h-full flex flex-col justify-between hover:border-green-500 transition-all">
                  <div>
                    <div className="w-14 h-14 bg-green-600/20 border-2 border-green-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      🔌
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      Provider Dashboard
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Turn your idle GPU hardware into revenue. Register a provider node, setup hardware specs, stake collateral, and submit execution proofs to get paid.
                    </p>
                  </div>
                  <div className="flex items-center text-green-400 font-bold text-sm uppercase">
                    Manage hardware <span>→</span>
                  </div>
                </div>
              </Link>
            </div>
          </>
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
          transition:
            box-shadow 0.15s ease,
            transform 0.15s ease;
        }
        .neo-card:hover {
          box-shadow: 4px 4px 0px #1a1a1a;
          transform: translate(1px, 1px);
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
