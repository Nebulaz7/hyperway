import { http, createConfig } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { type Chain } from "viem";

// Define Passet Hub (Polkadot Hub Testnet)
export const passetHub = {
  id: 420420422,
  name: "Passet Hub",
  nativeCurrency: { name: "Paseo", symbol: "PAS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-passet-hub-eth-rpc.polkadot.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://blockscout-passet-hub.parity-testnet.parity.io",
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "Hyperway",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get one at cloud.reown.com
  chains: [passetHub],
  ssr: true,
});
