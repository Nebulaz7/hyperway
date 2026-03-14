import { NextResponse } from "next/server";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  encodeFunctionData,
  verifyMessage,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { HYPERWAY_CONTRACT_ADDRESS } from "@/constants";
import { HYPERWAY_ABI } from "@/constants/abis";
import { polkadotHubTestnet } from "@/constants/chains";

/**
 * Gasless relay endpoint.
 *
 * The user signs a plain message authorizing the relay to call submitJob on
 * their behalf. The relayer wallet then calls submitJob directly, paying both
 * gas AND the job payment (PAS). The marketplace contract will record
 * `msg.sender` as the relayer, so the HyperwayMarketplace must use
 * `_msgSender()` (ERC2771) to attribute the job to the real user.
 *
 * NOTE: Because the ERC2771Forwarder contract deployed on Polkadot Hub TestNet
 * returns InvalidInstruction (likely compiled with PUSH0 / Solidity ≥0.8.20),
 * we bypass it entirely. The relayer calls submitJob directly.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { specCID, computeUnits, paymentAmount, userAddress, signature, message } = body;

    if (!specCID || !computeUnits || !paymentAmount || !userAddress || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required fields: specCID, computeUnits, paymentAmount, userAddress, signature, message" },
        { status: 400 }
      );
    }

    // 1. Verify the user actually signed the authorization
    const isValid = await verifyMessage({
      address: userAddress,
      message,
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Make sure relayer private key is available
    const pk = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
    if (!pk) {
      return NextResponse.json(
        { error: "Relayer not configured" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(pk);

    const walletClient = createWalletClient({
      account,
      chain: polkadotHubTestnet,
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: polkadotHubTestnet,
      transport: http(),
    });

    console.log(`[Relay] Submitting job for user ${userAddress}, payment: ${paymentAmount} PAS`);

    // 3. Submit the job directly from the relayer wallet
    const hash = await walletClient.writeContract({
      address: HYPERWAY_CONTRACT_ADDRESS,
      abi: HYPERWAY_ABI,
      functionName: "submitJob",
      args: [specCID as `0x${string}`, BigInt(computeUnits)],
      value: parseEther(paymentAmount),
    });

    console.log(`[Relay] Transaction sent: ${hash}`);

    // 4. Wait for receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });

    console.log(`[Relay] Transaction confirmed in block ${receipt.blockNumber}`);

    return NextResponse.json({
      hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
    });
  } catch (err: any) {
    console.error("[Relay] Error:", err);
    return NextResponse.json(
      { error: err.shortMessage || err.message || "Relay failed" },
      { status: 500 }
    );
  }
}
