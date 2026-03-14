import { type Chain } from "viem";

export const polkadotHubTestnet = {
  id: 420420417,
  name: "Polkadot Hub TestNet",
  nativeCurrency: { name: "Paseo", symbol: "PAS", decimals: 18 },
  rpcUrls: {
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
