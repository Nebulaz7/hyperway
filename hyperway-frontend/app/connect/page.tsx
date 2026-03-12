"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard once connected
  useEffect(() => {
    if (mounted && isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router, mounted]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] grid-background flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md neo-card !p-8 md:!p-12 text-center">
        <p>
          <Link
            href="/"
            className=" text-gray-500 hover:text-white transition text-sm font-bold flex items-center gap-2"
          >
            <span>←</span> Back to Home
          </Link>
        </p>
        <div className="w-16 h-16 bg-purple-600/20 border-2 border-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center text-3xl">
          ⚡
        </div>

        <h1 className="text-3xl font-bold mb-4 tracking-tight text-white">
          Connect to Hyperway
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Access the Polkadot Hub Testnet P2P GPU marketplace. Securely link
          your wallet to lease compute or register your hardware.
        </p>

        <div className="flex justify-center mb-8">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  className="w-full"
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="neo-btn w-full bg-purple-600 text-white text-lg py-4"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="neo-btn w-full bg-red-600 text-white text-lg py-4"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={() => router.push("/dashboard")}
                          type="button"
                          className="neo-btn w-full bg-purple-600 text-white text-lg py-4"
                        >
                          Go to Console
                        </button>
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="text-gray-500 text-sm hover:text-white transition font-bold"
                        >
                          Disconnect {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Faucet Link Section */}
        <div className="pt-6 border-t-2 border-gray-800 space-y-4">
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">
              Need test tokens for gas and staking?
            </p>
            <a
              href="https://faucet.polkadot.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 font-bold text-sm underline flex items-center justify-center gap-1"
            >
              Get PAS from the Faucet <span>↗</span>
            </a>
          </div>

          <p className="text-xs text-gray-500">
            New to Polkadot?{" "}
            <Link
              href="https://docs.polkadot.com/smart-contracts/connect/"
              target="_blank"
              className="text-gray-400 hover:text-white underline font-medium"
            >
              Setup your wallet
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .neo-card {
          background: #111111;
          border: 3px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 6px 6px 0px #1a1a1a;
          transition: all 0.15s ease;
        }
        .neo-card:hover {
          box-shadow: 4px 4px 0px #1a1a1a;
          transform: translate(1px, 1px);
        }
        .neo-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 3px solid currentColor;
          border-radius: 12px;
          padding: 8px 20px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
          transition: all 0.1s ease;
          text-decoration: none;
        }
        .neo-btn:hover {
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
          transform: translate(2px, 2px);
        }
        .neo-btn:active {
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.4);
          transform: translate(4px, 4px);
        }
      `}</style>
    </main>
  );
}
