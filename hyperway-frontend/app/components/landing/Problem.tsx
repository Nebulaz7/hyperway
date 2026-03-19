"use client";

import React from "react";
import { AlertTriangle, DollarSign, Globe2, Activity } from "lucide-react";

export default function Problem() {
  return (
    <section className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6 text-center max-w-6xl mx-auto relative" id="problem">
      
      {/* Sleek Pill Badge */}
      <div className="flex overflow-hidden bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-black to-black/5 w-fit border border-white/10 rounded-full mx-auto mb-6 sm:mb-8 pt-2 sm:pt-2.5 pr-2.5 sm:pr-3 pb-2 sm:pb-2.5 pl-2.5 sm:pl-3 relative shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm gap-x-2 gap-y-2 sm:gap-y-3 items-center">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70"></div>
        <div className="flex w-6 h-6 rounded-full items-center justify-center bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_2px_8px_rgba(124,58,237,0.4)]">
          <AlertTriangle className="w-[14px] h-[14px] text-white" />
        </div>
        <span className="text-xs font-medium text-white tracking-wide">The Compute Crisis</span>
      </div>

      {/* Bold Headline */}
      <h2 className="leading-tight text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-4xl mx-auto mb-6 sm:mb-8">
        AI Monopolies Are Stifling Innovation
      </h2>

      <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto mb-12 sm:mb-16">
        The AI revolution is bottlenecked by centralized cloud providers charging extortionate fees and imposing geographic limits. Meanwhile, millions of high-end GPUs sit <span className="text-white font-semibold">completely idle</span>.
      </p>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Card 1: Centralized Monopolies */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl text-left h-full">
          <div className="absolute -inset-1 bg-gradient-to-br from-red-600 to-red-500 opacity-20 group-hover:opacity-30 transition blur-xl"></div>
          <div className="relative h-full p-6 sm:p-8 bg-gradient-to-br from-red-950/40 to-black/80 border border-red-500/30 backdrop-blur-xl rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-200">Too Expensive</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 flex-grow">
              AWS, Google Cloud, and Azure charge $2-10/hour for basic cloud GPU instances. Small developers and researchers can't afford to train models, creating a massive innovation bottleneck.
            </p>
            <div className="px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 mt-auto">
              <span className="text-xs font-semibold text-red-300">10x markup over hardware cost</span>
            </div>
          </div>
        </div>

        {/* Card 2: Limited Access */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl text-left h-full">
          <div className="absolute -inset-1 bg-gradient-to-br from-orange-600 to-orange-500 opacity-20 group-hover:opacity-30 transition blur-xl"></div>
          <div className="relative h-full p-6 sm:p-8 bg-gradient-to-br from-orange-950/40 to-black/80 border border-orange-500/30 backdrop-blur-xl rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <Globe2 className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-orange-200">Geographic Barriers</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 flex-grow">
              Researchers in APAC, Africa, and Latin America face region locks, inflated pricing, and complex KYC requirements just to access basic compute resources.
            </p>
            <div className="px-3 py-2 rounded-md bg-orange-500/10 border border-orange-500/20 mt-auto">
              <span className="text-xs font-semibold text-orange-300">3 billion people excluded</span>
            </div>
          </div>
        </div>

        {/* Card 3: Idle GPUs */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl text-left h-full">
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-blue-500 opacity-20 group-hover:opacity-30 transition blur-xl"></div>
          <div className="relative h-full p-6 sm:p-8 bg-gradient-to-br from-blue-950/40 to-black/80 border border-blue-500/30 backdrop-blur-xl rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-200">Wasted Resources</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 flex-grow">
              Gaming rigs with RTX 4090s sit idle 18-22 hours/day. GPU owners can't easily monetize their $2,000-3,000 hardware investments while paying daily electricity costs.
            </p>
            <div className="px-3 py-2 rounded-md bg-blue-500/10 border border-blue-500/20 mt-auto">
              <span className="text-xs font-semibold text-blue-300">1B+ idle GPUs globally</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
