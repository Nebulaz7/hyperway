"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Disc as Discord } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 px-4 sm:px-6 mt-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Hyperway
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
              The first truly decentralized, scalable, and trustless GPU compute
              marketplace built on Polkadot Hub. Uncensored AI infrastructure
              for everyone.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/marketplace"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/provider-dashboard"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Provider Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  XCM Bridge
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Gasless Relay
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://github.com/Nebulaz7/hyperway"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Nebulaz7/hyperway"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Polkadot Hackathon Entry
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Nebulaz7/hyperway"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Smart Contracts (GitHub)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Hyperway. Built for Polkadot Hub.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Status: Operational
            </span>
            <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest pl-4 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full before:animate-pulse">
              EVM Connected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
