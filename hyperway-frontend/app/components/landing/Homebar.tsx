"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Homebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur-xl w-full overflow-x-hidden border-b border-white/10">
      <div className="lg:px-8 max-w-7xl mr-auto ml-auto px-4 sm:px-6 w-full">
        <div className="flex py-3 md:py-4 items-center justify-between">
          <Link href="/" className="inline-flex items-center justify-center flex-shrink-0">
             <span className="text-xl md:text-2xl font-bold text-white tracking-tighter">Hyperway</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/dashboard"
              className="inline-flex gap-2 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-sm font-medium text-white/90 font-geist bg-white/10 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur items-center"
            >
              Launch App
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden inline-flex transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-sm font-medium text-white/90 font-geist bg-white/10 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur gap-x-2 items-center" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Close Button Header */}
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="text-xl font-bold text-white tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                Hyperway
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-sm font-normal text-white/90 bg-white/10 border-white/10 border rounded-full p-2 backdrop-blur items-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              <Link 
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex gap-2 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-lg font-medium text-white font-geist bg-white/10 border-white/20 border rounded-full pt-3 pr-8 pb-3 pl-8 backdrop-blur items-center shadow-lg shadow-white/5"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Homebar;
