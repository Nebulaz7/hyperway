"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="mt-12 sm:mt-16 md:mt-32 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6 relative"
      id="cta"
    >
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-violet-900/40 to-black border border-violet-500/30 text-center shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-600/20 blur-[100px] rounded-full point-events-none"></div>

          <div className="relative z-10">
            <h2 className="leading-tight text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Ready to Break the Monopoly?
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
              Join the fastest-growing decentralized compute marketplace on
              Polkadot. Access high-end GPUs instantly or start monetizing your
              idle hardware today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/connect">
                <button className="group cursor-pointer relative w-full sm:w-auto text-sm sm:text-base font-semibold text-black bg-white rounded-md py-4 px-10 transition-all duration-300 hover:bg-gray-200 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] overflow-hidden">
                  <span className="relative z-10 w-full flex justify-center items-center gap-2">
                    Start Computing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              <Link href="/provider-dashboard">
                <button className="group cursor-pointer w-full sm:w-auto text-sm sm:text-base font-semibold text-white bg-white/10 border border-white/20 rounded-md py-4 px-10 transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-2">
                  <Terminal className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  Become a Provider
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
