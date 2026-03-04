"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to dashboard once connected
  //   useEffect(() => {
  //     if (isConnected) {
  //       router.push("/dashboard");
  //     }
  //   }, [isConnected, router]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-orange-400 rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 tracking-tight">
          Connect to Hyperway
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Access the Passet Hub P2P GPU marketplace. Securely link your wallet
          to lease compute or register your hardware.
        </p>

        <div className="flex justify-center mb-8">
          <ConnectButton.Custom>
            {({ openConnectModal, connectModalOpen }) => (
              <button
                onClick={openConnectModal}
                disabled={connectModalOpen}
                className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all active:scale-95 text-lg"
              >
                {connectModalOpen ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </ConnectButton.Custom>
        </div>

        <div className="pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500">
            New to Polkadot? <br />
            <Link
              href="https://docs.polkadot.com/smart-contracts/connect/"
              target="_blank"
              className="text-pink-500 hover:underline"
            >
              Learn how to setup your wallet
            </Link>
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 text-gray-500 hover:text-white transition text-sm"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
