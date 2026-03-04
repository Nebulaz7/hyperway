import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { type Chain } from "viem";

// 1. Official Polkadot Hub TestNet (Paseo) Specs
export const polkadotHubTestnet = {
  id: 420420417,
  name: "Polkadot Hub TestNet",
  nativeCurrency: { name: "Paseo", symbol: "PAS", decimals: 18 },
  rpcUrls: {
    // Using the OpsLayer URL as primary and Parity as fallback
    default: {
      http: [
        "https://services.polkadothub-rpc.com/testnet/",
        "https://eth-rpc-testnet.polkadot.io/",
      ],
    },
    public: { http: ["https://services.polkadothub-rpc.com/testnet/"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://blockscout-testnet.polkadot.io/",
    },
  },
} as const satisfies Chain;

// 2. Updated configuration
export const config = getDefaultConfig({
  appName: "Hyperway",
  // IMPORTANT: Make sure you use a valid Project ID from https://cloud.reown.com
  // This is mandatory for RainbowKit/WalletConnect to function!
  projectId: "29072b8e312a8b8ec6da473918c437e9",
  chains: [polkadotHubTestnet],
  transports: {
    [polkadotHubTestnet.id]: http(),
  },
  ssr: true,
});
