import { useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { HYPERWAY_CONTRACT_ADDRESS } from "@/constants";
import marketplaceAbi from "@/abis/HyperwayMarketplace.json";

export function useMarketplace() {
  const { writeContract } = useWriteContract();

  // Example: Hook to list a GPU
  const listGpu = (specs: string, pricePerByte: number) => {
    writeContract({
      abi: marketplaceAbi.abi,
      address: HYPERWAY_CONTRACT_ADDRESS,
      functionName: "listGPU",
      args: [specs, parseEther(pricePerByte.toString())],
    });
  };

  // Example: Hook to read total listings
  const { data: listingCount } = useReadContract({
    abi: marketplaceAbi.abi,
    address: HYPERWAY_CONTRACT_ADDRESS,
    functionName: "getListingCount",
  });

  return { listGpu, listingCount };
}
