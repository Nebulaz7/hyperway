"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap, Coins, Network } from "lucide-react";

export default function Solution() {
  return (
    <section className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6 text-center max-w-6xl mx-auto relative" id="solution">
      
      {/* Sleek Pill Badge */}
      <div className="flex overflow-hidden bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-black to-black/5 w-fit border border-violet-500/20 rounded-full mx-auto mb-6 sm:mb-8 pt-2 sm:pt-2.5 pr-2.5 sm:pr-3 pb-2 sm:pb-2.5 pl-2.5 sm:pl-3 relative shadow-[0px_2px_10px_-1px_rgba(139,92,246,0.3)] backdrop-blur-sm gap-x-2 gap-y-2 sm:gap-y-3 items-center">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-70"></div>
        <div className="flex w-6 h-6 rounded-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
          <Sparkles className="w-[14px] h-[14px] text-white" />
        </div>
        <span className="text-xs font-medium text-violet-100 tracking-wide">The Hyperway Solution</span>
      </div>

      {/* Bold Headline */}
      <h2 className="leading-tight text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-4xl mx-auto mb-6 sm:mb-8">
        Peer-to-Peer Compute on Polkadot
      </h2>

      <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto mb-12 sm:mb-16">
        Connect directly to a global network of decentralized compute nodes. No AWS markup, no corporate gatekeepers. Just raw, uncensored GPU power powered by Polkadot Hub.
      </p>

      {/* 2x2 Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 text-left">
        
        {/* Feature 1 */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative h-full p-6 sm:p-8 bg-[#0a0a0a] border border-white/5 group-hover:border-violet-500/30 transition-colors rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Trustless Execution</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Smart contracts on Polkadot Hub act as escrow. Funds are locked when a job is submitted and only released to the provider upon cryptographically verified completion.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative h-full p-6 sm:p-8 bg-[#0a0a0a] border border-white/5 group-hover:border-blue-500/30 transition-colors rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gasless Meta-Transactions</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Leveraging ERC2771 forwarders, developers interact with the compute marketplace with zero native gas tokens. Just sign a message, and Hyperway's relayer covers the fee.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative h-full p-6 sm:p-8 bg-[#0a0a0a] border border-white/5 group-hover:border-pink-500/30 transition-colors rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">XCM Interoperability</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Pay for model training and inference using native DOT or any supported parachain asset securely bridged via Polkadot Cross-Consensus Messaging (XCM).
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative h-full p-6 sm:p-8 bg-[#0a0a0a] border border-white/5 group-hover:border-emerald-500/30 transition-colors rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Permissionless Access</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Anyone with a Web3 wallet, internet connection, and compatible hardware can join the network today. No corporate accounts, no geographic lockouts.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
