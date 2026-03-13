import { NextResponse } from "next/server";
import { createWalletClient, http, publicActions, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CHAIN_ID, FORWARDER_ADDRESS } from "@/constants";
import { FORWARDER_ABI } from "@/constants/abis";
const polkadotHubTestnet = {
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
} as const;

export async function POST(req: Request) {
  try {
    const { request } = await req.json();

    if (!request) {
      return NextResponse.json({ error: "No request body provided" }, { status: 400 });
    }

    const pk = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
    if (!pk) {
      return NextResponse.json(
        { error: "RELAYER_PRIVATE_KEY not set in environment" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(pk);
    const client = createWalletClient({
      account,
      chain: polkadotHubTestnet,
      transport: http(),
    }).extend(publicActions);

    console.log("Relaying transaction from:", request.from);
    
    // Simulate the transaction first to catch reverts easily
    try {
      await client.simulateContract({
        address: FORWARDER_ADDRESS,
        abi: FORWARDER_ABI,
        functionName: "execute",
        args: [
          {
            from: request.from,
            to: request.to,
            value: BigInt(request.value),
            gas: BigInt(request.gas),
            deadline: Number(request.deadline),
            data: request.data,
            signature: request.signature,
          },
        ],
        account,
        value: BigInt(request.value),
      });
    } catch (simError: any) {
      console.error("Simulation failed:", simError);
      return NextResponse.json(
        { error: `Simulation failed: ${simError.message || "Unknown error"}` },
        { status: 400 }
      );
    }

    // Execute the transaction
    const hash = await client.writeContract({
      address: FORWARDER_ADDRESS,
      abi: FORWARDER_ABI,
      functionName: "execute",
      args: [
        {
          from: request.from,
          to: request.to,
          value: BigInt(request.value),
          gas: BigInt(request.gas),
          deadline: Number(request.deadline),
          data: request.data,
          signature: request.signature,
        },
      ],
      value: BigInt(request.value),
    });

    return NextResponse.json({ hash });
  } catch (err: any) {
    console.error("Relay error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
