import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polkadotHubTestnet } from "@/constants/chains";
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
