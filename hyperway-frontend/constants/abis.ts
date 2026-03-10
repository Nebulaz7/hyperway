// Auto-generated from forge build output — do NOT edit manually.
// Regenerate: copy abi from out/HyperwayMarketplace.sol/HyperwayMarketplace.json
import abi from "@/abis/HyperwayMarketplace.abi.json";

export const HYPERWAY_ABI = abi as typeof abi;

// ERC2771Forwarder ABI — only the functions we call from frontend
export const FORWARDER_ABI = [
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "request",
        type: "tuple",
        internalType: "struct ERC2771Forwarder.ForwardRequestData",
        components: [
          { name: "from", type: "address", internalType: "address" },
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "gas", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint48", internalType: "uint48" },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "verify",
    inputs: [
      {
        name: "request",
        type: "tuple",
        internalType: "struct ERC2771Forwarder.ForwardRequestData",
        components: [
          { name: "from", type: "address", internalType: "address" },
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "gas", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint48", internalType: "uint48" },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address",
      },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      { name: "extensions", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
] as const;
