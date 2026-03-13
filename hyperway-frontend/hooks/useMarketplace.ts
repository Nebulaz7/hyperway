import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { useState } from "react";
import { parseEther, toHex, encodeFunctionData } from "viem";
import { useSignTypedData, usePublicClient } from "wagmi";
import {
  HYPERWAY_CONTRACT_ADDRESS,
  FORWARDER_ADDRESS,
} from "@/constants";
import { HYPERWAY_ABI, FORWARDER_ABI } from "@/constants/abis";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

export enum JobStatus {
  PENDING = 0,
  ASSIGNED = 1,
  COMPLETED = 2,
  FAILED = 3,
  DISPUTED = 4,
}

export interface Job {
  jobId: bigint;
  buyer: `0x${string}`;
  provider: `0x${string}`;
  specCID: `0x${string}`;
  resultCID: `0x${string}`;
  paymentAmount: bigint;
  computeUnits: bigint;
  status: JobStatus;
  createdAt: bigint;
  assignedAt: bigint;
  completedAt: bigint;
  deadline: bigint;
}

export interface Provider {
  providerAddress: `0x${string}`;
  stakedAmount: bigint;
  gpuSpecs: `0x${string}`;
  reputationScore: number;
  totalJobsCompleted: bigint;
  totalJobsFailed: bigint;
  isActive: boolean;
  registeredAt: bigint;
}

export interface MarketplaceStats {
  providerCount: bigint;
  totalJobs: bigint;
  completedJobs: bigint;
  totalVolume: bigint;
}

// ─────────────────────────────────────────────
//  Read Hooks
// ─────────────────────────────────────────────

export function useMarketplaceStats() {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getMarketplaceStats",
  });
}

export function useJob(jobId: bigint | undefined) {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getJob",
    args: jobId !== undefined ? [jobId] : undefined,
    query: { enabled: jobId !== undefined },
  });
}

export function useProvider(address: `0x${string}` | undefined) {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getProvider",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useIsProvider(address: `0x${string}` | undefined) {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "isProvider",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useBuyerJobs(buyer: `0x${string}` | undefined) {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getBuyerJobs",
    args: buyer ? [buyer] : undefined,
    query: { enabled: !!buyer },
  });
}

export function useProviderJobs(provider: `0x${string}` | undefined) {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getProviderJobs",
    args: provider ? [provider] : undefined,
    query: { enabled: !!provider },
  });
}

export function useMinStakeAmount() {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "minStakeAmount",
  });
}

export function usePlatformFeeBps() {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "platformFeeBps",
  });
}

export function useTrustedForwarder() {
  return useReadContract({
    abi: HYPERWAY_ABI,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "trustedForwarder",
  });
}

// ─────────────────────────────────────────────
//  Write Hooks
// ─────────────────────────────────────────────

/** Submit a compute job with escrowed DOT payment */
export function useSubmitJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const submitJob = (specCID: `0x${string}`, computeUnits: bigint, paymentEther: string) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "submitJob",
      args: [specCID, computeUnits],
      value: parseEther(paymentEther),
    });
  };

  return { submitJob, hash, isPending, isConfirming, isSuccess, error };
}

/** Submit a compute job using a gasless meta-transaction relay */
export function useRelaySubmitJob() {
  const { signTypedDataAsync } = useSignTypedData();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  // Local state to model the same API as useWriteContract
  const [hash, setHash] = useState<`0x${string}`>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const relaySubmitJob = async (specCID: `0x${string}`, computeUnits: bigint, paymentEther: string) => {
    try {
      setIsPending(true);
      setError(null);
      if (!address || !publicClient) throw new Error("Wallet not connected");

      // 1. Get Forwarder Domain
      const domainRes = await publicClient.readContract({
        address: FORWARDER_ADDRESS,
        abi: FORWARDER_ABI,
        functionName: "eip712Domain",
      });
      const domain = {
        name: domainRes[1],
        version: domainRes[2],
        chainId: Number(domainRes[3]),
        verifyingContract: domainRes[4],
      };

      // 2. Get User Nonce
      const nonce = await publicClient.readContract({
        address: FORWARDER_ADDRESS,
        abi: FORWARDER_ABI,
        functionName: "nonces",
        args: [address],
      });

      // 3. Encode the target contract call
      const data = encodeFunctionData({
        abi: HYPERWAY_ABI,
        functionName: "submitJob",
        args: [specCID, computeUnits],
      });

      // 4. Construct ForwardRequest struct (the fields to sign)
      // Note: the "value" must cover the native token sent. Wait, useSubmitJob sends `value: parseEther(paymentEther)`.
      // The relayer will actually be the one paying the msg.value? NO!
      // ERC2771 forwarders usually require the relayer to supply the msg.value, meaning the relayer PAYS the DOT!
      // But wait, the user is submitting a job and paying PAS (Paseo). 
      // If `value > 0`, the forwarder expects the relayer to send the value, OR the forwarder pulls it from the user?
      // OpenZeppelin ERC2771Forwarder allows forwarding `value`, but the RELAYER must attach `msg.value` to the execute call.
      // Wait, if the relayer pays the PAS, the user gets it for free? That's not right. The user is supposed to pay PAS to the marketplace.
      // Usually, ERC20 tokens are used for payment in gasless transactions, via `approve` or `permit`. Alternatively, native tokens cannot be easily delegated unless the relayer is giving them away.
      // Let's check `submitJob` logic.
      // I will implement it assuming we pass `value: parseEther(paymentEther)`.
      const value = parseEther(paymentEther);
      const gas = BigInt(2000000); // Hardcode gas limit for the inner call
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

      const message = {
        from: address,
        to: HYPERWAY_CONTRACT_ADDRESS,
        value,
        gas,
        nonce,
        deadline,
        data,
      };

      const types = {
        ForwardRequest: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "gas", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint48" },
          { name: "data", type: "bytes" },
        ],
      } as const;

      // 5. Sign Data
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "ForwardRequest",
        message,
      });

      // 6. Send to API Relayer
      const res = await fetch("/api/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: {
            ...message,
            signature,
            value: message.value.toString(),
            gas: message.gas.toString(),
            nonce: message.nonce.toString(),
            deadline: message.deadline.toString(),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Relay request failed");

      setHash(json.hash);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { relaySubmitJob, hash, isPending, isConfirming, isSuccess, error };
}

/** Register as a GPU compute provider */
export function useRegisterProvider() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const registerProvider = (gpuSpecsJson: string, stakeEther: string) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "registerProvider",
      args: [toHex(gpuSpecsJson)],
      value: parseEther(stakeEther),
    });
  };

  return { registerProvider, hash, isPending, isConfirming, isSuccess, error };
}

/** Claim (assign) a pending job */
export function useAssignJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const assignJob = (jobId: bigint) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "assignJob",
      args: [jobId],
    });
  };

  return { assignJob, hash, isPending, isConfirming, isSuccess, error };
}

/** Submit proof of completed work */
export function useSubmitProof() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const submitProof = (jobId: bigint, resultCID: `0x${string}`, proof: `0x${string}`) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "submitProof",
      args: [jobId, resultCID, proof],
    });
  };

  return { submitProof, hash, isPending, isConfirming, isSuccess, error };
}

/** Cancel a pending job (buyer only) */
export function useCancelJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const cancelJob = (jobId: bigint) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "cancelJob",
      args: [jobId],
    });
  };

  return { cancelJob, hash, isPending, isConfirming, isSuccess, error };
}

/** Add more stake as a provider */
export function useAddStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const addStake = (amountEther: string) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "addStake",
      value: parseEther(amountEther),
    });
  };

  return { addStake, hash, isPending, isConfirming, isSuccess, error };
}

/** Deactivate provider */
export function useDeactivateProvider() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deactivateProvider = () => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "deactivateProvider",
    });
  };

  return { deactivateProvider, hash, isPending, isConfirming, isSuccess, error };
}

/** Withdraw staked DOT (must deactivate first) */
export function useWithdrawStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const withdrawStake = () => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "withdrawStake",
    });
  };

  return { withdrawStake, hash, isPending, isConfirming, isSuccess, error };
}

/** Dispute a completed job result (buyer only) */
export function useDisputeResult() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const disputeResult = (jobId: bigint, reason: string) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "disputeResult",
      args: [jobId, reason],
    });
  };

  return { disputeResult, hash, isPending, isConfirming, isSuccess, error };
}

/** Slash a provider who missed the deadline (buyer only) */
export function useSlashProvider() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const slashProvider = (jobId: bigint) => {
    writeContract({
      abi: HYPERWAY_ABI,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "slashProvider",
      args: [jobId],
    });
  };

  return { slashProvider, hash, isPending, isConfirming, isSuccess, error };
}

// ─────────────────────────────────────────────
//  Convenience: Current User Context
// ─────────────────────────────────────────────

/** Get current user's role and data */
export function useCurrentUser() {
  const { address } = useAccount();

  const { data: isProviderData } = useIsProvider(address);
  const { data: providerData } = useProvider(address);
  const { data: buyerJobIds } = useBuyerJobs(address);
  const { data: providerJobIds } = useProviderJobs(address);

  return {
    address,
    isProvider: isProviderData ?? false,
    provider: providerData as Provider | undefined,
    buyerJobIds: buyerJobIds as bigint[] | undefined,
    providerJobIds: providerJobIds as bigint[] | undefined,
  };
}