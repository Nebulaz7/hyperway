"use client";

import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fetch PAS balance on Polkadot Hub Testnet
  const { data: balance } = useBalance({
    address: address,
  });

  // Handle hydration and protection
  useEffect(() => {
    setMounted(true);
    if (mounted && !isConnected) {
      router.push("/connect");
    }
  }, [isConnected, router, mounted]);

  if (!mounted || !isConnected) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Sidebar / Topbar Navigation */}
      <nav className="border-b border-white/5 bg-[#0a0a0a] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-black tracking-tighter uppercase text-pink-500"
          >
            Hyperway
          </Link>
          <span className="h-4 w-[1px] bg-white/20" />
          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
            {chain?.name || "Polkadot Hub"}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Wallet Address
            </p>
            <p className="text-xs font-mono text-gray-300">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <button
            onClick={() => disconnect()}
            className="text-xs bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 px-4 py-2 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Console</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Infrastructure overview for your compute nodes and leases.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111] border border-white/5 p-8 rounded-3xl group hover:border-pink-500/30 transition-colors">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Available Balance
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {balance ? parseFloat(balance.formatted).toFixed(4) : "0.00"}
              </span>
              <span className="text-pink-500 font-bold uppercase">
                {balance?.symbol}
              </span>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Active Jobs
            </h3>
            <p className="text-4xl font-bold">0</p>
          </div>

          <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Node Status
            </h3>
            <div className="flex items-center gap-2 text-4xl font-bold text-gray-600">
              Inactive
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Compute Instances</h2>
            <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all">
              + Lease GPU
            </button>
          </div>

          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">
              No active leases found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
              Start developing your AI models limitlessly by accessing our
              peer-to-peer GPU grid.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
