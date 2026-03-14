"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useSubstrateAccountId } from "@/hooks/useMarketplace";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="pb-2 sticky top-0 w-full shrink-0 bg-primary/50 backdrop-blur-xl z-30">
      <div className="flex justify-between items-center gap-5 w-full max-w-7xl px-2 md:px-6 h-[3.5rem] mx-auto">
        <div
          role="link"
          tabIndex={0}
          className="select-none cursor-pointer outline-0"
          onClick={() => router.push("/")}
        >
          <h1 className="text-[24px] ">
            Hyperway{" "}
            <span className="text-sm text-white  p-[6px] border-solid border-[1.3px] border-white rounded-full">
              Beta
            </span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <SubstrateAddressDisplay />
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              if (!mounted) return null;
              if (!account || !chain) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="appearance-none cursor-pointer px-6 py-1 font-heading rounded-full text-sm bg-white/10 border border-white/20 hover:bg-white/20 focus-visible:bg-white/20 text-white backdrop-blur-sm transition-all duration-200"
                  >
                    Connect Wallet
                  </button>
                );
              }
              return (
                <button
                  onClick={openAccountModal}
                  className="appearance-none cursor-pointer px-6 py-1 font-heading rounded-full text-sm bg-[#1a1a1a] border border-white/20 text-purple-300 hover:bg-white/5 transition-all duration-200"
                >
                  {account.displayName}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
};

const SubstrateAddressDisplay = () => {
  const { address } = useAccount();
  const { data: substrateId } = useSubstrateAccountId(address);

  if (!address || !substrateId) return null;

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-300 font-mono group relative cursor-help">
      <span>Substrate: {substrateId.slice(0, 6)}...{substrateId.slice(-4)}</span>
      <div className="absolute top-full right-0 mt-2 p-2 bg-[#111] border border-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 w-64 pointer-events-none">
        <p className="text-gray-400 mb-1">Polkadot Native Address:</p>
        <p className="text-white break-all">{substrateId}</p>
        <p className="mt-2 text-[9px] text-purple-400">Mapped via System Precompile (PVM Superpower)</p>
      </div>
    </div>
  );
};

export default Navbar;
