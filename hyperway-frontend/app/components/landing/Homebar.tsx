"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Homebar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur-xl w-full overflow-x-hidden border-b border-white/10">
      <div className="lg:px-8 max-w-7xl mr-auto ml-auto px-4 sm:px-6 w-full">
        <div className="flex py-3 md:py-4 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center flex-shrink-0"
          >
            <span className="text-xl md:text-2xl font-bold text-white tracking-tighter">
              Hyperway
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/connect"
              className="inline-flex gap-2 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-sm font-medium text-white/90 font-geist bg-white/10 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur items-center"
            >
              Launch App
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Link
            href="/connect"
            className="lg:hidden inline-flex transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-sm font-medium text-white/90 font-geist bg-white/10 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur gap-x-2 items-center"
          >
            <Menu className="w-4 h-4" />
            <span>Launch</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Homebar;
