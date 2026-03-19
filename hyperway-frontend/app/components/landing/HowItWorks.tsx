"use client";

import React, { useState } from "react";
import { Laptop, Database, Cpu, Wallet, Lock, UploadCloud } from "lucide-react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"devs" | "providers">("devs");

  return (
    <section className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6 text-center max-w-6xl mx-auto relative" id="how-it-works">
      
      {/* Sleek Pill Badge */}
      <div className="flex overflow-hidden bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-black to-black/5 w-fit border border-emerald-500/20 rounded-full mx-auto mb-6 sm:mb-8 pt-2 sm:pt-2.5 pr-2.5 sm:pr-3 pb-2 sm:pb-2.5 pl-2.5 sm:pl-3 relative shadow-[0px_2px_10px_-1px_rgba(16,185,129,0.3)] backdrop-blur-sm gap-x-2 gap-y-2 sm:gap-y-3 items-center">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70"></div>
        <div className="flex w-6 h-6 rounded-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
          <Database className="w-[14px] h-[14px] text-white" />
        </div>
        <span className="text-xs font-medium text-emerald-100 tracking-wide">How It Works</span>
      </div>

      {/* Bold Headline */}
      <h2 className="leading-tight text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-4xl mx-auto mb-6 sm:mb-8">
        Frictionless Onboarding for Both Sides
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-12 sm:mb-16 relative z-10">
        <div className="bg-white/5 p-1.5 rounded-xl inline-flex border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("devs")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "devs" 
                ? "bg-violet-600/80 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.6)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            For Developers
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "providers" 
                ? "bg-blue-600/80 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.6)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            For Providers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* For Developers */}
        {activeTab === "devs" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Step 1 */}
            <div className="relative p-8 bg-gradient-to-br from-violet-950/20 to-black border border-violet-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-violet-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/30 group-hover:bg-violet-500/20 transition-colors">
                <Laptop className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Define Needs</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Specify your model, framework (PyTorch/TF), min VRAM, and processing unit via our simple DApp.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative p-8 bg-gradient-to-br from-violet-950/20 to-black border border-violet-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-violet-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/30 group-hover:bg-violet-500/20 transition-colors">
                <Wallet className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Escrow Payment</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Connect your wallet to lock funds securely in the smart contract using a gasless ERC2771 forwarder.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 bg-gradient-to-br from-violet-950/20 to-black border border-violet-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-violet-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/30 group-hover:bg-violet-500/20 transition-colors">
                <UploadCloud className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Deploy & Monitor</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Data uploads securely via IPFS. The matching provider executes the job and streams logs directly back.
              </p>
            </div>
          </div>
        )}

        {/* For Providers */}
        {activeTab === "providers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Step 1 */}
            <div className="relative p-8 bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:bg-blue-500/20 transition-colors">
                <Cpu className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Download Client</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Install the Hyperway Worker Node. It auto-benchmarks your hardware and securely creates an identity.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative p-8 bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:bg-blue-500/20 transition-colors">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Stake & Match</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Stake PAS to prevent malicious activity. The P2P indexer matches you flawlessly with incoming workloads.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/20 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:bg-blue-500/20 transition-colors">
                <Database className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Execute & Earn</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Pull models securely from IPFS, compute, and post cryptographic proofs to claim your auto-released funds.
              </p>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
