"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useSubstrateAccountId } from "@/hooks/useMarketplace";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Blockie from "./Blockie";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-purple-500 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-6 h-16">
        <div
          role="link"
          tabIndex={0}
          className="select-none cursor-pointer outline-0 flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hyperway
            <span className="ml-2 text-[10px] font-mono text-purple-400 border border-purple-500 rounded px-1.5 py-0.5 uppercase">
              Beta
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-6 mr-4">
            <Link
              href="/marketplace"
              className={`text-sm font-bold transition-colors ${
                pathname === "/marketplace" ? "text-purple-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Marketplace
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-bold transition-colors ${
                    pathname === "/dashboard" ? "text-purple-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/submit-job"
                  className={`text-sm font-bold transition-colors ${
                    pathname === "/submit-job" ? "text-purple-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Submit Job
                </Link>
              </>
            )}
          </nav>

          <SubstrateAddressDisplay />

          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
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
                  <Blockie address={account.address as `0x${string}`} size={18} />
                  {account.displayName}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
      <style jsx>{`
        .neo-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 2px solid currentColor;
          border-radius: 12px;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .neo-btn-sm {
          padding: 4px 14px;
          font-size: 13px;
        }
        .neo-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0px currentColor;
        }
      `}</style>
    </header>
  );
};

const SubstrateAddressDisplay = () => {
  const { address } = useAccount();
  const { data: substrateId } = useSubstrateAccountId(address);

  if (!address || !substrateId) return null;

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border-2 border-purple-500/30 text-[11px] text-purple-300 font-mono group relative cursor-help transition-all hover:border-purple-500/60">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        Substrate: {substrateId.slice(0, 5)}...{substrateId.slice(-4)}
      </span>
      <div className="absolute top-full right-0 mt-3 p-3 bg-[#0a0a0a] border-2 border-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-50 w-72 pointer-events-none shadow-[8px 8px 0px rgba(0,0,0,0.5)]">
        <p className="text-gray-500 text-[10px] uppercase font-bold mb-1.5 tracking-wider">Polkadot Native Address</p>
        <p className="text-white break-all text-xs font-mono bg-black/50 p-2 rounded-lg border border-white/10">{substrateId}</p>
        <p className="mt-2.5 text-[10px] text-purple-400 font-bold border-t border-purple-500/20 pt-2 flex items-center gap-1.5">
          <span className="text-sm">⚡</span> Mapped via System Precompile
        </p>
      </div>
    </div>
  );
};

export default Navbar;
