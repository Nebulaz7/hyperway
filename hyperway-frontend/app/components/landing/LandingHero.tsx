"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, Users, Coins } from "lucide-react";

export default function LandingHero() {
  const [typedText1, setTypedText1] = useState("");
  const [typedText2, setTypedText2] = useState("");
  const text1 = "Decentralized GPU Compute.";
  const text2 = "Uncensorable AI Infrastructure.";

  useEffect(() => {
    let i = 0;
    const typing1 = setInterval(() => {
      setTypedText1(text1.slice(0, i));
      i++;
      if (i > text1.length) {
        clearInterval(typing1);
        let j = 0;
        const typing2 = setInterval(() => {
          setTypedText2(text2.slice(0, j));
          j++;
          if (j > text2.length) clearInterval(typing2);
        }, 50);
      }
    }, 50);
    return () => clearInterval(typing1);
  }, []);

  return (
    <section className="relative overflow-x-hidden overflow-y-visible pt-36 pb-20 md:pt-48 md:pb-32" id="home">
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>

      <div className="text-center max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Badge */}
        <div className="flex gap-2 sm:gap-3 overflow-hidden bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-black to-black/5 w-fit border-white/10 border rounded-full mx-auto mb-6 sm:mb-8 pt-2 sm:pt-2.5 pr-2.5 sm:pr-3 pb-2 sm:pb-2.5 pl-2.5 sm:pl-3 relative shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm items-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-violet-300 ring-1 ring-inset ring-violet-500/30">
            Powered by Polkadot
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-white/70">
            Hackathon 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight max-w-4xl mx-auto">
          <span className="block h-[1.2em]">{typedText1}</span>
          <span className="block font-light text-white/60 h-[1.2em]">
            {typedText2}
          </span>
        </h1>

        {/* Copy */}
        <p className="leading-relaxed text-sm sm:text-lg text-white/60 max-w-2xl mt-8 mx-auto px-4">
          Access affordable AI compute power or monetize your idle GPUs — all
          secured by smart contracts on Polkadot Hub. No intermediaries. No
          censorship. Just trustless execution at 70% lower cost than AWS.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-16">
          <Link href="/marketplace">
            <button className="group relative text-sm sm:text-base font-semibold text-white bg-transparent border border-violet-500/50 rounded-md py-4 px-10 transition-all duration-300 hover:border-violet-400 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] overflow-hidden">
              <span className="relative z-10 w-full flex justify-center items-center gap-2">
                Launch App
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
          <Link href="/provider-dashboard">
            <button className="group text-sm sm:text-base font-semibold text-white/80 bg-white/5 border border-white/10 rounded-md py-4 px-10 transition-all duration-300 hover:bg-white/10 hover:text-white">
              Become a Provider
            </button>
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-2xl font-bold text-white mb-1">1,204</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Total Jobs</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white mb-1">89</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Active Providers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white mb-1">14,350 DOT</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Volume (DOT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
