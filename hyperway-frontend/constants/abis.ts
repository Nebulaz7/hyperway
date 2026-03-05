export const HYPERWAY_ABI = [
  {
    abi: [
      {
        type: "constructor",
        inputs: [
          { name: "_feeRecipient", type: "address", internalType: "address" },
        ],
        stateMutability: "nonpayable",
      },
      { type: "receive", stateMutability: "payable" },
      {
        type: "function",
        name: "BPS_DENOMINATOR",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "XCM_PRECOMPILE",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "addStake",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "assignJob",
        inputs: [{ name: "jobId", type: "uint256", internalType: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "buyerJobs",
        inputs: [
          { name: "", type: "address", internalType: "address" },
          { name: "", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "cancelJob",
        inputs: [{ name: "jobId", type: "uint256", internalType: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "deactivateProvider",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "disputeResult",
        inputs: [
          { name: "jobId", type: "uint256", internalType: "uint256" },
          { name: "reason", type: "string", internalType: "string" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "estimateXCMWeight",
        inputs: [{ name: "message", type: "bytes", internalType: "bytes" }],
        outputs: [
          { name: "refTime", type: "uint64", internalType: "uint64" },
          { name: "proofSize", type: "uint64", internalType: "uint64" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "feeRecipient",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getBuyerJobs",
        inputs: [{ name: "buyer", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getJob",
        inputs: [{ name: "jobId", type: "uint256", internalType: "uint256" }],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct HyperwayMarketplace.Job",
            components: [
              { name: "jobId", type: "uint256", internalType: "uint256" },
              { name: "buyer", type: "address", internalType: "address" },
              { name: "provider", type: "address", internalType: "address" },
              { name: "specCID", type: "bytes32", internalType: "bytes32" },
              { name: "resultCID", type: "bytes32", internalType: "bytes32" },
              {
                name: "paymentAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "computeUnits",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "status",
                type: "uint8",
                internalType: "enum HyperwayMarketplace.JobStatus",
              },
              { name: "createdAt", type: "uint256", internalType: "uint256" },
              { name: "assignedAt", type: "uint256", internalType: "uint256" },
              { name: "completedAt", type: "uint256", internalType: "uint256" },
              { name: "deadline", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getMarketplaceStats",
        inputs: [],
        outputs: [
          { name: "_providerCount", type: "uint256", internalType: "uint256" },
          { name: "_totalJobs", type: "uint256", internalType: "uint256" },
          { name: "_completedJobs", type: "uint256", internalType: "uint256" },
          { name: "_totalVolume", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getProvider",
        inputs: [
          { name: "providerAddr", type: "address", internalType: "address" },
        ],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct HyperwayMarketplace.Provider",
            components: [
              {
                name: "providerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "stakedAmount",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "gpuSpecs", type: "bytes", internalType: "bytes" },
              { name: "reputationScore", type: "uint8", internalType: "uint8" },
              {
                name: "totalJobsCompleted",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "totalJobsFailed",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "isActive", type: "bool", internalType: "bool" },
              {
                name: "registeredAt",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getProviderJobs",
        inputs: [
          { name: "provider", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "isProvider",
        inputs: [{ name: "", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "jobs",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [
          { name: "jobId", type: "uint256", internalType: "uint256" },
          { name: "buyer", type: "address", internalType: "address" },
          { name: "provider", type: "address", internalType: "address" },
          { name: "specCID", type: "bytes32", internalType: "bytes32" },
          { name: "resultCID", type: "bytes32", internalType: "bytes32" },
          { name: "paymentAmount", type: "uint256", internalType: "uint256" },
          { name: "computeUnits", type: "uint256", internalType: "uint256" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum HyperwayMarketplace.JobStatus",
          },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "assignedAt", type: "uint256", internalType: "uint256" },
          { name: "completedAt", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "minStakeAmount",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "nextJobId",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "pause",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "paused",
        inputs: [],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "platformFeeBps",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "providerCount",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "providerJobs",
        inputs: [
          { name: "", type: "address", internalType: "address" },
          { name: "", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "providers",
        inputs: [{ name: "", type: "address", internalType: "address" }],
        outputs: [
          { name: "providerAddress", type: "address", internalType: "address" },
          { name: "stakedAmount", type: "uint256", internalType: "uint256" },
          { name: "gpuSpecs", type: "bytes", internalType: "bytes" },
          { name: "reputationScore", type: "uint8", internalType: "uint8" },
          {
            name: "totalJobsCompleted",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "totalJobsFailed", type: "uint256", internalType: "uint256" },
          { name: "isActive", type: "bool", internalType: "bool" },
          { name: "registeredAt", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "reactivateProvider",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "registerProvider",
        inputs: [{ name: "gpuSpecs", type: "bytes", internalType: "bytes" }],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "resolveDispute",
        inputs: [
          { name: "jobId", type: "uint256", internalType: "uint256" },
          { name: "buyerWins", type: "bool", internalType: "bool" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "sendXCMMessage",
        inputs: [
          { name: "destination", type: "bytes", internalType: "bytes" },
          { name: "message", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setFeeRecipient",
        inputs: [
          { name: "newRecipient", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setMinStakeAmount",
        inputs: [
          { name: "newMinStake", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setPlatformFee",
        inputs: [
          { name: "newFeeBps", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "slashProvider",
        inputs: [{ name: "jobId", type: "uint256", internalType: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "submitJob",
        inputs: [
          { name: "specCID", type: "bytes32", internalType: "bytes32" },
          { name: "computeUnits", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "submitJobWithXCM",
        inputs: [
          { name: "specCID", type: "bytes32", internalType: "bytes32" },
          { name: "computeUnits", type: "uint256", internalType: "uint256" },
          { name: "xcmMessage", type: "bytes", internalType: "bytes" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "submitProof",
        inputs: [
          { name: "jobId", type: "uint256", internalType: "uint256" },
          { name: "resultCID", type: "bytes32", internalType: "bytes32" },
          { name: "proof", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "totalJobsCompleted",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "totalJobsCreated",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "totalVolumeEscrowed",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          { name: "newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "unpause",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "updateGPUSpecs",
        inputs: [{ name: "newSpecs", type: "bytes", internalType: "bytes" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdrawStake",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "DisputeResolved",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "buyerWins",
            type: "bool",
            indexed: false,
            internalType: "bool",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "FeeRecipientUpdated",
        inputs: [
          {
            name: "newRecipient",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "GPUSpecsUpdated",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "newSpecs",
            type: "bytes",
            indexed: false,
            internalType: "bytes",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "JobAssigned",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "JobCompleted",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "providerPayment",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "JobDisputed",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "buyer",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "reason",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "JobFailed",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "JobSubmitted",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "buyer",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "specCID",
            type: "bytes32",
            indexed: false,
            internalType: "bytes32",
          },
          {
            name: "payment",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "MinStakeUpdated",
        inputs: [
          {
            name: "newMinStake",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "OwnershipTransferred",
        inputs: [
          {
            name: "previousOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "newOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "Paused",
        inputs: [
          {
            name: "account",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "PlatformFeeUpdated",
        inputs: [
          {
            name: "newFeeBps",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProofSubmitted",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "resultCID",
            type: "bytes32",
            indexed: false,
            internalType: "bytes32",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProviderDeactivated",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProviderReactivated",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProviderRegistered",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "stakedAmount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "gpuSpecs",
            type: "bytes",
            indexed: false,
            internalType: "bytes",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProviderSlashed",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "slashAmount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "reason",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "StakeWithdrawn",
        inputs: [
          {
            name: "provider",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "Unpaused",
        inputs: [
          {
            name: "account",
            type: "address",
            indexed: false,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "XCMJobSubmitted",
        inputs: [
          {
            name: "jobId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "buyer",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "specCID",
            type: "bytes32",
            indexed: false,
            internalType: "bytes32",
          },
        ],
        anonymous: false,
      },
      { type: "error", name: "AlreadyRegistered", inputs: [] },
      { type: "error", name: "DeadlineNotReached", inputs: [] },
      { type: "error", name: "EnforcedPause", inputs: [] },
      { type: "error", name: "ExpectedPause", inputs: [] },
      {
        type: "error",
        name: "InsufficientStake",
        inputs: [
          { name: "sent", type: "uint256", internalType: "uint256" },
          { name: "required", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        type: "error",
        name: "InvalidFee",
        inputs: [{ name: "feeBps", type: "uint256", internalType: "uint256" }],
      },
      { type: "error", name: "JobDoesNotExist", inputs: [] },
      { type: "error", name: "JobNotAssigned", inputs: [] },
      { type: "error", name: "JobNotPending", inputs: [] },
      { type: "error", name: "NotAssignedProvider", inputs: [] },
      { type: "error", name: "NotJobBuyer", inputs: [] },
      { type: "error", name: "NotProvider", inputs: [] },
      { type: "error", name: "NothingToWithdraw", inputs: [] },
      {
        type: "error",
        name: "OwnableInvalidOwner",
        inputs: [{ name: "owner", type: "address", internalType: "address" }],
      },
      {
        type: "error",
        name: "OwnableUnauthorizedAccount",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
      },
      { type: "error", name: "PaymentRequired", inputs: [] },
      { type: "error", name: "ProviderHasActiveJobs", inputs: [] },
      { type: "error", name: "ProviderNotActive", inputs: [] },
      { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
      { type: "error", name: "TransferFailed", inputs: [] },
      { type: "error", name: "ZeroAddress", inputs: [] },
    ],
    bytecode: {
      object:
        "0x60806040526001600555670de0b6b3a764000060085560fa600955348015610025575f5ffd5b50604051615d2f380380615d2f833981810160405281019061004791906102e8565b33600161006661005b61019760201b60201c565b6101c060201b60201c565b5f01819055505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100dc575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100d39190610322565b60405180910390fd5b6100eb816101c960201b60201c565b505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610151576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600a5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061033b565b5f7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f005f1b905090565b5f819050919050565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102b78261028e565b9050919050565b6102c7816102ad565b81146102d1575f5ffd5b50565b5f815190506102e2816102be565b92915050565b5f602082840312156102fd576102fc61028a565b5b5f61030a848285016102d4565b91505092915050565b61031c816102ad565b82525050565b5f6020820190506103355f830184610313565b92915050565b6159e7806103485f395ff3fe608060405260043610610275575f3560e01c80636b074a071161014e578063bd9257cf116100c0578063e1a4521811610079578063e1a45218146108fe578063e74b981b14610928578063eb4af04514610950578063f188768414610978578063f2640b5e146109a2578063f2fde38b146109de5761027c565b8063bd9257cf14610807578063bed9d8611461081d578063bf22c45714610833578063c6371f8e1461086f578063ce02dd7d146108ac578063d40ab082146108e85761027c565b80638648a5b2116101125780638648a5b2146106f55780638da5cb5b146107315780638ee0decf1461075b578063927a831b14610785578063a16a7d7a146107c1578063b0c2aa5e146107dd5761027c565b80636b074a0714610636578063715018a61461067257806374c8326814610688578063812d966a146106b25780638456cb59146106df5761027c565b80633c60e0b1116101e757806347d4b8cc116101ab57806347d4b8cc1461054457806355f21eb71461056e5780635a627dbc146105aa5780635c975abb146105b45780635d3dec24146105de5780635e215cf01461060e5761027c565b80633c60e0b1146104785780633dd68feb146104a05780633f4ba83a146104c8578063437505bf146104de578063469048401461051a5761027c565b80631adabe0f116102395780631adabe0f146103845780631dffa3dc146103ac57806322dcd13e146103d457806322ef57bd146103fe57806334b25ee214610428578063371ac6ce146104505761027c565b806306e36d0314610280578063077120cc146102a85780630787bc27146102d257806312e8e2c314610315578063180aedf31461033d5761027c565b3661027c57005b5f5ffd5b34801561028b575f5ffd5b506102a660048036038101906102a1919061442a565b610a06565b005b3480156102b3575f5ffd5b506102bc610a83565b6040516102c991906144e7565b60405180910390f35b3480156102dd575f5ffd5b506102f860048036038101906102f3919061452a565b610a8a565b60405161030c989796959493929190614612565b60405180910390f35b348015610320575f5ffd5b5061033b600480360381019061033691906146bf565b610b8b565b005b348015610348575f5ffd5b50610363600480360381019061035e91906146bf565b610c1b565b60405161037b9c9b9a99989796959493929190614775565b60405180910390f35b34801561038f575f5ffd5b506103aa60048036038101906103a591906146bf565b610cc1565b005b3480156103b7575f5ffd5b506103d260048036038101906103cd91906146bf565b611270565b005b3480156103df575f5ffd5b506103e861151a565b6040516103f5919061482d565b60405180910390f35b348015610409575f5ffd5b50610412611520565b60405161041f919061482d565b60405180910390f35b348015610433575f5ffd5b5061044e60048036038101906104499190614870565b611526565b005b34801561045b575f5ffd5b50610476600480360381019061047191906148ae565b611a2c565b005b348015610483575f5ffd5b5061049e600480360381019061049991906146bf565b611b50565b005b3480156104ab575f5ffd5b506104c660048036038101906104c19190614923565b611e45565b005b3480156104d3575f5ffd5b506104dc6122bd565b005b3480156104e9575f5ffd5b5061050460048036038101906104ff919061452a565b6122cf565b6040516105119190614a4b565b60405180910390f35b348015610525575f5ffd5b5061052e612362565b60405161053b91906144e7565b60405180910390f35b34801561054f575f5ffd5b50610558612387565b604051610565919061482d565b60405180910390f35b348015610579575f5ffd5b50610594600480360381019061058f919061452a565b61238d565b6040516105a19190614b8d565b60405180910390f35b6105b2612527565b005b3480156105bf575f5ffd5b506105c86126bb565b6040516105d59190614bad565b60405180910390f35b6105f860048036038101906105f39190614bc6565b6126d0565b604051610605919061482d565b60405180910390f35b348015610619575f5ffd5b50610634600480360381019061062f9190614c59565b6129ea565b005b348015610641575f5ffd5b5061065c6004803603810190610657919061452a565b612c08565b6040516106699190614bad565b60405180910390f35b34801561067d575f5ffd5b50610686612c25565b005b348015610693575f5ffd5b5061069c612c38565b6040516106a9919061482d565b60405180910390f35b3480156106bd575f5ffd5b506106c6612c3e565b6040516106d69493929190614cb6565b60405180910390f35b3480156106ea575f5ffd5b506106f3612c5c565b005b348015610700575f5ffd5b5061071b60048036038101906107169190614cf9565b612c6e565b604051610728919061482d565b60405180910390f35b34801561073c575f5ffd5b506107456130fb565b60405161075291906144e7565b60405180910390f35b348015610766575f5ffd5b5061076f613122565b60405161077c919061482d565b60405180910390f35b348015610790575f5ffd5b506107ab60048036038101906107a69190614d6a565b613128565b6040516107b8919061482d565b60405180910390f35b6107db60048036038101906107d691906148ae565b613153565b005b3480156107e8575f5ffd5b506107f1613484565b6040516107fe919061482d565b60405180910390f35b348015610812575f5ffd5b5061081b61348a565b005b348015610828575f5ffd5b50610831613671565b005b34801561083e575f5ffd5b50610859600480360381019061085491906146bf565b613938565b6040516108669190614eba565b60405180910390f35b34801561087a575f5ffd5b50610895600480360381019061089091906148ae565b613aa1565b6040516108a3929190614ef6565b60405180910390f35b3480156108b7575f5ffd5b506108d260048036038101906108cd9190614d6a565b613b37565b6040516108df919061482d565b60405180910390f35b3480156108f3575f5ffd5b506108fc613b62565b005b348015610909575f5ffd5b50610912613c7e565b60405161091f919061482d565b60405180910390f35b348015610933575f5ffd5b5061094e6004803603810190610949919061452a565b613c84565b005b34801561095b575f5ffd5b50610976600480360381019061097191906146bf565b613d6b565b005b348015610983575f5ffd5b5061098c613db4565b604051610999919061482d565b60405180910390f35b3480156109ad575f5ffd5b506109c860048036038101906109c3919061452a565b613dba565b6040516109d59190614a4b565b60405180910390f35b3480156109e9575f5ffd5b50610a0460048036038101906109ff919061452a565b613e4d565b005b610a0e613ed1565b620a000073ffffffffffffffffffffffffffffffffffffffff16637f0a3bf9858585856040518563ffffffff1660e01b8152600401610a509493929190614f57565b5f604051808303815f87803b158015610a67575f5ffd5b505af1158015610a79573d5f5f3e3d5ffd5b5050505050505050565b620a000081565b6001602052805f5260405f205f91509050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001015490806002018054610ad490614fbd565b80601f0160208091040260200160405190810160405280929190818152602001828054610b0090614fbd565b8015610b4b5780601f10610b2257610100808354040283529160200191610b4b565b820191905f5260205f20905b815481529060010190602001808311610b2e57829003601f168201915b505050505090806003015f9054906101000a900460ff1690806004015490806005015490806006015f9054906101000a900460ff16908060070154905088565b610b93613ed1565b6103e8811115610bda57806040517f2f38c6ee000000000000000000000000000000000000000000000000000000008152600401610bd1919061482d565b60405180910390fd5b806009819055507f45610d581145924dd7090a5017e5f2b1d6f42213bb2e95707ff86846bbfcb1ca81604051610c10919061482d565b60405180910390a150565b6004602052805f5260405f205f91509050805f015490806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003015490806004015490806005015490806006015490806007015f9054906101000a900460ff169080600801549080600901549080600a01549080600b015490508c565b610cc9613f58565b805f811480610cda57506005548110155b15610d11576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610dad576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016004811115610dc157610dc0614702565b5b816007015f9054906101000a900460ff166004811115610de457610de3614702565b5b14610e1b576040517f94dc143900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600b01544211610e58576040517f66ec4ee600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6003816007015f6101000a81548160ff02191690836004811115610e7f57610e7e614702565b5b02179055505f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f600a8260010154610ef99190615047565b905080826001015f828254610f0e9190615077565b92505081905550816005015f815480929190610f29906150aa565b9190505550610f5b836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff165f613f7a565b60085482600101541015610feb575f826006015f6101000a81548160ff021916908315150217905550826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f3584a4db7306d80246748a1c4bc6188505b8053684afee0c79670dade4db205c60405160405180910390a25b5f836005015411156110bf575f836001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1684600501546040516110439061511e565b5f6040518083038185875af1925050503d805f811461107d576040519150601f19603f3d011682016040523d82523d5f602084013e611082565b606091505b50509050806110bd576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f811115611189575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161110d9061511e565b5f6040518083038185875af1925050503d805f8114611147576040519150601f19603f3d011682016040523d82523d5f602084013e61114c565b606091505b5050905080611187576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff7e9b02351a3253c4d2fc01f058822791511c72929065515978606eb09279002826040516111f2919061518c565b60405180910390a2826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16857fd58f2a4e069708a89a2a10de98f25ed4b483a239586791231948ef38a39c109c60405160405180910390a35050505061126d614017565b50565b611278613f58565b805f81148061128957506005548110155b156112c0576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461135c576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f600481111561136f5761136e614702565b5b816007015f9054906101000a900460ff16600481111561139257611391614702565b5b146113c9576040517f04c0a3d500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6003816007015f6101000a81548160ff021916908360048111156113f0576113ef614702565b5b02179055505f816005015411156114c9575f816001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16826005015460405161144d9061511e565b5f6040518083038185875af1925050503d805f8114611487576040519150601f19603f3d011682016040523d82523d5f602084013e61148c565b606091505b50509050806114c7576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f73ffffffffffffffffffffffffffffffffffffffff16837fd58f2a4e069708a89a2a10de98f25ed4b483a239586791231948ef38a39c109c60405160405180910390a35050611517614017565b50565b60095481565b600b5481565b61152e613ed1565b611536613f58565b815f81148061154757506005548110155b1561157e576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8581526020019081526020015f2090506004808111156115a5576115a4614702565b5b816007015f9054906101000a900460ff1660048111156115c8576115c7614702565b5b14611608576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ff90615202565b60405180910390fd5b8215611927576003816007015f6101000a81548160ff0219169083600481111561163557611634614702565b5b02179055505f8160050154111561170e575f816001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682600501546040516116929061511e565b5f6040518083038185875af1925050503d805f81146116cc576040519150601f19603f3d011682016040523d82523d5f602084013e6116d1565b606091505b505090508061170c576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f600a82600101546117839190615047565b905080826001015f8282546117989190615077565b92505081905550816005015f8154809291906117b3906150aa565b91905055506117e5836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff165f613f7a565b5f8111156118af575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16826040516118339061511e565b5f6040518083038185875af1925050503d805f811461186d576040519150601f19603f3d011682016040523d82523d5f602084013e611872565b606091505b50509050806118ad576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff7e9b02351a3253c4d2fc01f058822791511c72929065515978606eb0927900282604051611918919061526a565b60405180910390a250506119e6565b6002816007015f6101000a81548160ff0219169083600481111561194e5761194d614702565b5b02179055505f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090506119e4826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001613f7a565b505b837f5a87909bff68caaaaf0b3fd9c74eeccc928832f879315e5c6fb7a73612f26c0c84604051611a169190614bad565b60405180910390a25050611a28614017565b5050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16611aac576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b818160015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206002019182611afb92919061546d565b503373ffffffffffffffffffffffffffffffffffffffff167fc5eb1d386f3ae9f3483a635c4e1d91cf40f144d08daf355cb3fa2204a41f99058383604051611b4492919061553a565b60405180910390a25050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16611bd0576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff16611c53576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805f811480611c6457506005548110155b15611c9b576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611ca3614031565b5f60045f8481526020019081526020015f2090505f6004811115611cca57611cc9614702565b5b816007015f9054906101000a900460ff166004811115611ced57611cec614702565b5b14611d24576040517f04c0a3d500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b33816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001816007015f6101000a81548160ff02191690836004811115611d8d57611d8c614702565b5b021790555042816009018190555060065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2083908060018154018082558091505060019003905f5260205f20015f90919091909150553373ffffffffffffffffffffffffffffffffffffffff16837f3738a681a43a0b6a554742a08bae57e0215e8a774217dc2e7de6c9411b6d0ddc60405160405180910390a3505050565b611e4d613f58565b835f811480611e5e57506005548110155b15611e95576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8781526020019081526020015f209050806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611f31576040517fec0ea20600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016004811115611f4557611f44614702565b5b816007015f9054906101000a900460ff166004811115611f6857611f67614702565b5b14611f9f576040517f94dc143900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8481600401819055506002816007015f6101000a81548160ff02191690836004811115611fcf57611fce614702565b5b02179055504281600a01819055505f6127106009548360050154611ff3919061555c565b611ffd9190615047565b90505f8183600501546120109190615077565b90505f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f209050806004015f815480929190612066906150aa565b9190505550612076336001613f7a565b600c5f815480929190612088906150aa565b91905055505f821115612159575f846002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16836040516120dd9061511e565b5f6040518083038185875af1925050503d805f8114612117576040519150601f19603f3d011682016040523d82523d5f602084013e61211c565b606091505b5050905080612157576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f831115612223575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16846040516121a79061511e565b5f6040518083038185875af1925050503d805f81146121e1576040519150601f19603f3d011682016040523d82523d5f602084013e6121e6565b606091505b5050905080612221576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b887f556d8e38b75e3e273793af33ddc3e1c8bc47d1cd092b52f3a239d9d1c881899789604051612253919061559d565b60405180910390a23373ffffffffffffffffffffffffffffffffffffffff16897f4dbba472101e9f148a3a5ecbe793f0ee16a7efe4bf3f8cbfab5330e1642ef955846040516122a2919061482d565b60405180910390a350505050506122b7614017565b50505050565b6122c5613ed1565b6122cd614072565b565b606060075f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2080548060200260200160405190810160405280929190818152602001828054801561235657602002820191905f5260205f20905b815481526020019060010190808311612342575b50505050509050919050565b600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d5481565b6123956142cc565b60015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20604051806101000160405290815f82015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820154815260200160028201805461244c90614fbd565b80601f016020809104026020016040519081016040528092919081815260200182805461247890614fbd565b80156124c35780601f1061249a576101008083540402835291602001916124c3565b820191905f5260205f20905b8154815290600101906020018083116124a657829003601f168201915b50505050508152602001600382015f9054906101000a900460ff1660ff1660ff1681526020016004820154815260200160058201548152602001600682015f9054906101000a900460ff161515151581526020016007820154815250509050919050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166125a7576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff1661262a576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f3403612663576040517f8b87dfbb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3460015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015f8282546126b291906155b6565b92505081905550565b5f5f60149054906101000a900460ff16905090565b5f6126d9614031565b5f3403612712576040517f8b87dfbb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60055f815480929190612725906150aa565b9190505590506040518061018001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020018581526020015f5f1b81526020013481526020018481526020015f60048111156127a2576127a1614702565b5b81526020014281526020015f81526020015f81526020016002856127c6919061555c565b426127d191906155b6565b81525060045f8381526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015f6101000a81548160ff021916908360048111156128cb576128ca614702565b5b02179055506101008201518160080155610120820151816009015561014082015181600a015561016082015181600b015590505060075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081908060018154018082558091505060019003905f5260205f20015f9091909190915055600b5f815480929190612972906150aa565b919050555034600d5f82825461298891906155b6565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16817f82ceda8df44c52270b6d81f3237243f4b8923f90f8b6aeb084687785c047dd9b86346040516129d89291906155e9565b60405180910390a38091505092915050565b825f8114806129fb57506005548110155b15612a32576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8681526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614612ace576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60026004811115612ae257612ae1614702565b5b816007015f9054906101000a900460ff166004811115612b0557612b04614702565b5b1480612b45575060016004811115612b2057612b1f614702565b5b816007015f9054906101000a900460ff166004811115612b4357612b42614702565b5b145b612b84576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612b7b9061565a565b60405180910390fd5b6004816007015f6101000a81548160ff02191690836004811115612bab57612baa614702565b5b02179055503373ffffffffffffffffffffffffffffffffffffffff16857fb59122d87b9a129d9dbb8103c368a3de4e00b50a9fc86c22d48c74cca778e6708686604051612bf99291906156a4565b60405180910390a35050505050565b6002602052805f5260405f205f915054906101000a900460ff1681565b612c2d613ed1565b612c365f6140d3565b565b60035481565b5f5f5f5f600354600b54600c54600d54935093509350935090919293565b612c64613ed1565b612c6c614194565b565b5f612c77614031565b612c7f613f58565b5f4790505f620a000090505f8173ffffffffffffffffffffffffffffffffffffffff166347400c2387876040518363ffffffff1660e01b8152600401612cc692919061553a565b6040805180830381865afa158015612ce0573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612d04919061578c565b90508173ffffffffffffffffffffffffffffffffffffffff1663d3b7e04d8787846040518463ffffffff1660e01b8152600401612d43939291906157f3565b5f604051808303815f87803b158015612d5a575f5ffd5b505af1158015612d6c573d5f5f3e3d5ffd5b505050505f4790505f8482612d819190615077565b90505f8111612dc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612dbc9061586d565b60405180910390fd5b5f60055f815480929190612dd8906150aa565b9190505590506040518061018001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020018c81526020015f5f1b81526020018381526020018b81526020015f6004811115612e5557612e54614702565b5b81526020014281526020015f81526020015f815260200160028c612e79919061555c565b42612e8491906155b6565b81525060045f8381526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015f6101000a81548160ff02191690836004811115612f7e57612f7d614702565b5b02179055506101008201518160080155610120820151816009015561014082015181600a015561016082015181600b015590505060075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081908060018154018082558091505060019003905f5260205f20015f9091909190915055600b5f815480929190613025906150aa565b919050555081600d5f82825461303b91906155b6565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16817fd78fa691ce29993622e854349fb124a4ef0cad764f67487c9a0f3b381f6dee0a8d604051613089919061559d565b60405180910390a33373ffffffffffffffffffffffffffffffffffffffff16817f82ceda8df44c52270b6d81f3237243f4b8923f90f8b6aeb084687785c047dd9b8d856040516130da9291906155e9565b60405180910390a38096505050505050506130f3614017565b949350505050565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600c5481565b6006602052815f5260405f208181548110613141575f80fd5b905f5260205f20015f91509150505481565b61315b614031565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16156131dc576040517f3a81d6fc00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60085434101561322757346008546040517f45be0a2600000000000000000000000000000000000000000000000000000000815260040161321e92919061588b565b60405180910390fd5b6040518061010001604052803373ffffffffffffffffffffffffffffffffffffffff16815260200134815260200183838080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f820116905080830192505050505050508152602001603260ff1681526020015f81526020015f81526020016001151581526020014281525060015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201908161336191906158b2565b506060820151816003015f6101000a81548160ff021916908360ff1602179055506080820151816004015560a0820151816005015560c0820151816006015f6101000a81548160ff02191690831515021790555060e08201518160070155905050600160025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555060035f815480929190613429906150aa565b91905055503373ffffffffffffffffffffffffffffffffffffffff167f79fda11c69e0429d87cf53e6967d16c56a3d80a7e6e67dd03ccf7f20d6285fc034848460405161347893929190615981565b60405180910390a25050565b60055481565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1661350a576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60085460015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015410156135d55760015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20600101546008546040517f45be0a260000000000000000000000000000000000000000000000000000000081526004016135cc92919061588b565b60405180910390fd5b6001805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f8b618344327d585386a081c7767b76c59d001736d6299027a0367fcdea17e75060405160405180910390a2565b613679613f58565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166136f9576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff161561377d576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015490505f81036137fa576040517fd0d04f6000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20600101819055505f3373ffffffffffffffffffffffffffffffffffffffff16826040516138649061511e565b5f6040518083038185875af1925050503d805f811461389e576040519150601f19603f3d011682016040523d82523d5f602084013e6138a3565b606091505b50509050806138de576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f8108595eb6bad3acefa9da467d90cc2217686d5c5ac85460f8b7849c840645fc83604051613924919061482d565b60405180910390a25050613936614017565b565b613940614325565b60045f8381526020019081526020015f20604051806101800160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820154815260200160068201548152602001600782015f9054906101000a900460ff166004811115613a5c57613a5b614702565b5b6004811115613a6e57613a6d614702565b5b81526020016008820154815260200160098201548152602001600a8201548152602001600b820154815250509050919050565b5f5f5f620a000073ffffffffffffffffffffffffffffffffffffffff166347400c2386866040518363ffffffff1660e01b8152600401613ae292919061553a565b6040805180830381865afa158015613afc573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613b20919061578c565b9050805f0151816020015192509250509250929050565b6007602052815f5260405f208181548110613b50575f80fd5b905f5260205f20015f91509150505481565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16613be2576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f3584a4db7306d80246748a1c4bc6188505b8053684afee0c79670dade4db205c60405160405180910390a2565b61271081565b613c8c613ed1565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603613cf1576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600a5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f7a7b5a0a132f9e0581eb8527f66eae9ee89c2a3e79d4ac7e41a1f1f4d48a7fc281604051613d6091906144e7565b60405180910390a150565b613d73613ed1565b806008819055507f47ab46f2c8d4258304a2f5551c1cbdb6981be49631365d1ba7191288a73f39ef81604051613da9919061482d565b60405180910390a150565b60085481565b606060065f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20805480602002602001604051908101604052809291908181526020018280548015613e4157602002820191905f5260205f20905b815481526020019060010190808311613e2d575b50505050509050919050565b613e55613ed1565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603613ec5575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401613ebc91906144e7565b60405180910390fd5b613ece816140d3565b50565b613ed96141f6565b73ffffffffffffffffffffffffffffffffffffffff16613ef76130fb565b73ffffffffffffffffffffffffffffffffffffffff1614613f5657613f1a6141f6565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401613f4d91906144e7565b60405180910390fd5b565b613f606141fd565b6002613f72613f6d61423e565b614267565b5f0181905550565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f81600501548260040154613fcf91906155b6565b90505f811115614011578060648360040154613feb919061555c565b613ff59190615047565b826003015f6101000a81548160ff021916908360ff1602179055505b50505050565b600161402961402461423e565b614267565b5f0181905550565b6140396126bb565b15614070576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b61407a614270565b5f5f60146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6140bc6141f6565b6040516140c991906144e7565b60405180910390a1565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61419c614031565b60015f60146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586141df6141f6565b6040516141ec91906144e7565b60405180910390a1565b5f33905090565b6142056142b0565b1561423c576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f005f1b905090565b5f819050919050565b6142786126bb565b6142ae576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f60026142c36142be61423e565b614267565b5f015414905090565b6040518061010001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f8152602001606081526020015f60ff1681526020015f81526020015f81526020015f151581526020015f81525090565b6040518061018001604052805f81526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f81526020015f81526020015f81526020015f81526020015f600481111561439a57614399614702565b5b81526020015f81526020015f81526020015f81526020015f81525090565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83601f8401126143ea576143e96143c9565b5b8235905067ffffffffffffffff811115614407576144066143cd565b5b602083019150836001820283011115614423576144226143d1565b5b9250929050565b5f5f5f5f60408587031215614442576144416143c1565b5b5f85013567ffffffffffffffff81111561445f5761445e6143c5565b5b61446b878288016143d5565b9450945050602085013567ffffffffffffffff81111561448e5761448d6143c5565b5b61449a878288016143d5565b925092505092959194509250565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6144d1826144a8565b9050919050565b6144e1816144c7565b82525050565b5f6020820190506144fa5f8301846144d8565b92915050565b614509816144c7565b8114614513575f5ffd5b50565b5f8135905061452481614500565b92915050565b5f6020828403121561453f5761453e6143c1565b5b5f61454c84828501614516565b91505092915050565b5f819050919050565b61456781614555565b82525050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6145af8261456d565b6145b98185614577565b93506145c9818560208601614587565b6145d281614595565b840191505092915050565b5f60ff82169050919050565b6145f2816145dd565b82525050565b5f8115159050919050565b61460c816145f8565b82525050565b5f610100820190506146265f83018b6144d8565b614633602083018a61455e565b818103604083015261464581896145a5565b905061465460608301886145e9565b614661608083018761455e565b61466e60a083018661455e565b61467b60c0830185614603565b61468860e083018461455e565b9998505050505050505050565b61469e81614555565b81146146a8575f5ffd5b50565b5f813590506146b981614695565b92915050565b5f602082840312156146d4576146d36143c1565b5b5f6146e1848285016146ab565b91505092915050565b5f819050919050565b6146fc816146ea565b82525050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b600581106147405761473f614702565b5b50565b5f8190506147508261472f565b919050565b5f61475f82614743565b9050919050565b61476f81614755565b82525050565b5f610180820190506147895f83018f61455e565b614796602083018e6144d8565b6147a3604083018d6144d8565b6147b0606083018c6146f3565b6147bd608083018b6146f3565b6147ca60a083018a61455e565b6147d760c083018961455e565b6147e460e0830188614766565b6147f261010083018761455e565b61480061012083018661455e565b61480e61014083018561455e565b61481c61016083018461455e565b9d9c50505050505050505050505050565b5f6020820190506148405f83018461455e565b92915050565b61484f816145f8565b8114614859575f5ffd5b50565b5f8135905061486a81614846565b92915050565b5f5f60408385031215614886576148856143c1565b5b5f614893858286016146ab565b92505060206148a48582860161485c565b9150509250929050565b5f5f602083850312156148c4576148c36143c1565b5b5f83013567ffffffffffffffff8111156148e1576148e06143c5565b5b6148ed858286016143d5565b92509250509250929050565b614902816146ea565b811461490c575f5ffd5b50565b5f8135905061491d816148f9565b92915050565b5f5f5f5f6060858703121561493b5761493a6143c1565b5b5f614948878288016146ab565b94505060206149598782880161490f565b935050604085013567ffffffffffffffff81111561497a576149796143c5565b5b614986878288016143d5565b925092505092959194509250565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6149c681614555565b82525050565b5f6149d783836149bd565b60208301905092915050565b5f602082019050919050565b5f6149f982614994565b614a03818561499e565b9350614a0e836149ae565b805f5b83811015614a3e578151614a2588826149cc565b9750614a30836149e3565b925050600181019050614a11565b5085935050505092915050565b5f6020820190508181035f830152614a6381846149ef565b905092915050565b614a74816144c7565b82525050565b5f82825260208201905092915050565b5f614a948261456d565b614a9e8185614a7a565b9350614aae818560208601614587565b614ab781614595565b840191505092915050565b614acb816145dd565b82525050565b614ada816145f8565b82525050565b5f61010083015f830151614af65f860182614a6b565b506020830151614b0960208601826149bd565b5060408301518482036040860152614b218282614a8a565b9150506060830151614b366060860182614ac2565b506080830151614b4960808601826149bd565b5060a0830151614b5c60a08601826149bd565b5060c0830151614b6f60c0860182614ad1565b5060e0830151614b8260e08601826149bd565b508091505092915050565b5f6020820190508181035f830152614ba58184614ae0565b905092915050565b5f602082019050614bc05f830184614603565b92915050565b5f5f60408385031215614bdc57614bdb6143c1565b5b5f614be98582860161490f565b9250506020614bfa858286016146ab565b9150509250929050565b5f5f83601f840112614c1957614c186143c9565b5b8235905067ffffffffffffffff811115614c3657614c356143cd565b5b602083019150836001820283011115614c5257614c516143d1565b5b9250929050565b5f5f5f60408486031215614c7057614c6f6143c1565b5b5f614c7d868287016146ab565b935050602084013567ffffffffffffffff811115614c9e57614c9d6143c5565b5b614caa86828701614c04565b92509250509250925092565b5f608082019050614cc95f83018761455e565b614cd6602083018661455e565b614ce3604083018561455e565b614cf0606083018461455e565b95945050505050565b5f5f5f5f60608587031215614d1157614d106143c1565b5b5f614d1e8782880161490f565b9450506020614d2f878288016146ab565b935050604085013567ffffffffffffffff811115614d5057614d4f6143c5565b5b614d5c878288016143d5565b925092505092959194509250565b5f5f60408385031215614d8057614d7f6143c1565b5b5f614d8d85828601614516565b9250506020614d9e858286016146ab565b9150509250929050565b614db1816146ea565b82525050565b614dc081614755565b82525050565b61018082015f820151614ddb5f8501826149bd565b506020820151614dee6020850182614a6b565b506040820151614e016040850182614a6b565b506060820151614e146060850182614da8565b506080820151614e276080850182614da8565b5060a0820151614e3a60a08501826149bd565b5060c0820151614e4d60c08501826149bd565b5060e0820151614e6060e0850182614db7565b50610100820151614e756101008501826149bd565b50610120820151614e8a6101208501826149bd565b50610140820151614e9f6101408501826149bd565b50610160820151614eb46101608501826149bd565b50505050565b5f61018082019050614ece5f830184614dc6565b92915050565b5f67ffffffffffffffff82169050919050565b614ef081614ed4565b82525050565b5f604082019050614f095f830185614ee7565b614f166020830184614ee7565b9392505050565b828183375f83830152505050565b5f614f368385614577565b9350614f43838584614f1d565b614f4c83614595565b840190509392505050565b5f6040820190508181035f830152614f70818688614f2b565b90508181036020830152614f85818486614f2b565b905095945050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680614fd457607f821691505b602082108103614fe757614fe6614f90565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61505182614555565b915061505c83614555565b92508261506c5761506b614fed565b5b828204905092915050565b5f61508182614555565b915061508c83614555565b92508282039050818111156150a4576150a361501a565b5b92915050565b5f6150b482614555565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036150e6576150e561501a565b5b600182019050919050565b5f81905092915050565b50565b5f6151095f836150f1565b9150615114826150fb565b5f82019050919050565b5f615128826150fe565b9150819050919050565b5f82825260208201905092915050565b7f4a6f622074696d656f75740000000000000000000000000000000000000000005f82015250565b5f615176600b83615132565b915061518182615142565b602082019050919050565b5f60408201905061519f5f83018461455e565b81810360208301526151b08161516a565b905092915050565b7f4a6f62206e6f74206469737075746564000000000000000000000000000000005f82015250565b5f6151ec601083615132565b91506151f7826151b8565b602082019050919050565b5f6020820190508181035f830152615219816151e0565b9050919050565b7f44697370757465206c6f737400000000000000000000000000000000000000005f82015250565b5f615254600c83615132565b915061525f82615220565b602082019050919050565b5f60408201905061527d5f83018461455e565b818103602083015261528e81615248565b905092915050565b5f82905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026153297fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826152ee565b61533386836152ee565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61536e61536961536484614555565b61534b565b614555565b9050919050565b5f819050919050565b61538783615354565b61539b61539382615375565b8484546152fa565b825550505050565b5f5f905090565b6153b26153a3565b6153bd81848461537e565b505050565b5b818110156153e0576153d55f826153aa565b6001810190506153c3565b5050565b601f821115615425576153f6816152cd565b6153ff846152df565b8101602085101561540e578190505b61542261541a856152df565b8301826153c2565b50505b505050565b5f82821c905092915050565b5f6154455f198460080261542a565b1980831691505092915050565b5f61545d8383615436565b9150826002028217905092915050565b6154778383615296565b67ffffffffffffffff8111156154905761548f6152a0565b5b61549a8254614fbd565b6154a58282856153e4565b5f601f8311600181146154d2575f84156154c0578287013590505b6154ca8582615452565b865550615531565b601f1984166154e0866152cd565b5f5b82811015615507578489013582556001820191506020850194506020810190506154e2565b868310156155245784890135615520601f891682615436565b8355505b6001600288020188555050505b50505050505050565b5f6020820190508181035f830152615553818486614f2b565b90509392505050565b5f61556682614555565b915061557183614555565b925082820261557f81614555565b915082820484148315176155965761559561501a565b5b5092915050565b5f6020820190506155b05f8301846146f3565b92915050565b5f6155c082614555565b91506155cb83614555565b92508282019050808211156155e3576155e261501a565b5b92915050565b5f6040820190506155fc5f8301856146f3565b615609602083018461455e565b9392505050565b7f43616e6e6f7420646973707574652074686973206a6f622073746174757300005f82015250565b5f615644601e83615132565b915061564f82615610565b602082019050919050565b5f6020820190508181035f83015261567181615638565b9050919050565b5f6156838385615132565b9350615690838584614f1d565b61569983614595565b840190509392505050565b5f6020820190508181035f8301526156bd818486615678565b90509392505050565b5f5ffd5b6156d382614595565b810181811067ffffffffffffffff821117156156f2576156f16152a0565b5b80604052505050565b5f6157046143b8565b905061571082826156ca565b919050565b61571e81614ed4565b8114615728575f5ffd5b50565b5f8151905061573981615715565b92915050565b5f60408284031215615754576157536156c6565b5b61575e60406156fb565b90505f61576d8482850161572b565b5f8301525060206157808482850161572b565b60208301525092915050565b5f604082840312156157a1576157a06143c1565b5b5f6157ae8482850161573f565b91505092915050565b6157c081614ed4565b82525050565b604082015f8201516157da5f8501826157b7565b5060208201516157ed60208501826157b7565b50505050565b5f6060820190508181035f83015261580c818587614f2b565b905061581b60208301846157c6565b949350505050565b7f58434d3a206e6f2066756e6473207265636569766564000000000000000000005f82015250565b5f615857601683615132565b915061586282615823565b602082019050919050565b5f6020820190508181035f8301526158848161584b565b9050919050565b5f60408201905061589e5f83018561455e565b6158ab602083018461455e565b9392505050565b6158bb8261456d565b67ffffffffffffffff8111156158d4576158d36152a0565b5b6158de8254614fbd565b6158e98282856153e4565b5f60209050601f83116001811461591a575f8415615908578287015190505b6159128582615452565b865550615979565b601f198416615928866152cd565b5f5b8281101561594f5784890151825560018201915060208501945060208101905061592a565b8683101561596c5784890151615968601f891682615436565b8355505b6001600288020188555050505b505050505050565b5f6040820190506159945f83018661455e565b81810360208301526159a7818486614f2b565b905094935050505056fea26469706673582212202c650318c6975216db0dc77703ee71a98e0b5f45931efe990effacbbb4fffe3464736f6c634300081c0033",
      sourceMap:
        "833:27845:27:-:0;;;4208:1;4181:28;;4453:7;4421:39;;4533:3;4501:35;;8406:163;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;8449:10;2365:1:23;2539:46;:29;:27;;;:29;;:::i;:::-;:44;;;:46;;:::i;:::-;:52;;:66;;;;1297:1:20;1273:26;;:12;:26;;;1269:95;;1350:1;1322:31;;;;;;;;;;;:::i;:::-;;;;;;;;1269:95;1373:32;1392:12;1373:18;;;:32;;:::i;:::-;1225:187;8500:1:27::1;8475:27;;:13;:27;;::::0;8471:53:::1;;8511:13;;;;;;;;;;;;;;8471:53;8549:13;8534:12;;:28;;;;;;;;;;;;;;;;;;8406:163:::0;833:27845;;4636:127:23;4706:7;1505:66;4732:24;;4725:31;;4636:127;:::o;2679:163:24:-;2740:21;2822:4;2812:14;;2679:163;;;:::o;2912:187:20:-;2985:16;3004:6;;;;;;;;;;;2985:25;;3029:8;3020:6;;:17;;;;;;;;;;;;;;;;;;3083:8;3052:40;;3073:8;3052:40;;;;;;;;;;;;2975:124;2912:187;:::o;88:117:30:-;197:1;194;187:12;334:126;371:7;411:42;404:5;400:54;389:65;;334:126;;;:::o;466:96::-;503:7;532:24;550:5;532:24;:::i;:::-;521:35;;466:96;;;:::o;568:122::-;641:24;659:5;641:24;:::i;:::-;634:5;631:35;621:63;;680:1;677;670:12;621:63;568:122;:::o;696:143::-;753:5;784:6;778:13;769:22;;800:33;827:5;800:33;:::i;:::-;696:143;;;;:::o;845:351::-;915:6;964:2;952:9;943:7;939:23;935:32;932:119;;;970:79;;:::i;:::-;932:119;1090:1;1115:64;1171:7;1162:6;1151:9;1147:22;1115:64;:::i;:::-;1105:74;;1061:128;845:351;;;;:::o;1202:118::-;1289:24;1307:5;1289:24;:::i;:::-;1284:3;1277:37;1202:118;;:::o;1326:222::-;1419:4;1457:2;1446:9;1442:18;1434:26;;1470:71;1538:1;1527:9;1523:17;1514:6;1470:71;:::i;:::-;1326:222;;;;:::o;833:27845:27:-;;;;;;;",
      linkReferences: {},
    },
    deployedBytecode: {
      object:
        "0x608060405260043610610275575f3560e01c80636b074a071161014e578063bd9257cf116100c0578063e1a4521811610079578063e1a45218146108fe578063e74b981b14610928578063eb4af04514610950578063f188768414610978578063f2640b5e146109a2578063f2fde38b146109de5761027c565b8063bd9257cf14610807578063bed9d8611461081d578063bf22c45714610833578063c6371f8e1461086f578063ce02dd7d146108ac578063d40ab082146108e85761027c565b80638648a5b2116101125780638648a5b2146106f55780638da5cb5b146107315780638ee0decf1461075b578063927a831b14610785578063a16a7d7a146107c1578063b0c2aa5e146107dd5761027c565b80636b074a0714610636578063715018a61461067257806374c8326814610688578063812d966a146106b25780638456cb59146106df5761027c565b80633c60e0b1116101e757806347d4b8cc116101ab57806347d4b8cc1461054457806355f21eb71461056e5780635a627dbc146105aa5780635c975abb146105b45780635d3dec24146105de5780635e215cf01461060e5761027c565b80633c60e0b1146104785780633dd68feb146104a05780633f4ba83a146104c8578063437505bf146104de578063469048401461051a5761027c565b80631adabe0f116102395780631adabe0f146103845780631dffa3dc146103ac57806322dcd13e146103d457806322ef57bd146103fe57806334b25ee214610428578063371ac6ce146104505761027c565b806306e36d0314610280578063077120cc146102a85780630787bc27146102d257806312e8e2c314610315578063180aedf31461033d5761027c565b3661027c57005b5f5ffd5b34801561028b575f5ffd5b506102a660048036038101906102a1919061442a565b610a06565b005b3480156102b3575f5ffd5b506102bc610a83565b6040516102c991906144e7565b60405180910390f35b3480156102dd575f5ffd5b506102f860048036038101906102f3919061452a565b610a8a565b60405161030c989796959493929190614612565b60405180910390f35b348015610320575f5ffd5b5061033b600480360381019061033691906146bf565b610b8b565b005b348015610348575f5ffd5b50610363600480360381019061035e91906146bf565b610c1b565b60405161037b9c9b9a99989796959493929190614775565b60405180910390f35b34801561038f575f5ffd5b506103aa60048036038101906103a591906146bf565b610cc1565b005b3480156103b7575f5ffd5b506103d260048036038101906103cd91906146bf565b611270565b005b3480156103df575f5ffd5b506103e861151a565b6040516103f5919061482d565b60405180910390f35b348015610409575f5ffd5b50610412611520565b60405161041f919061482d565b60405180910390f35b348015610433575f5ffd5b5061044e60048036038101906104499190614870565b611526565b005b34801561045b575f5ffd5b50610476600480360381019061047191906148ae565b611a2c565b005b348015610483575f5ffd5b5061049e600480360381019061049991906146bf565b611b50565b005b3480156104ab575f5ffd5b506104c660048036038101906104c19190614923565b611e45565b005b3480156104d3575f5ffd5b506104dc6122bd565b005b3480156104e9575f5ffd5b5061050460048036038101906104ff919061452a565b6122cf565b6040516105119190614a4b565b60405180910390f35b348015610525575f5ffd5b5061052e612362565b60405161053b91906144e7565b60405180910390f35b34801561054f575f5ffd5b50610558612387565b604051610565919061482d565b60405180910390f35b348015610579575f5ffd5b50610594600480360381019061058f919061452a565b61238d565b6040516105a19190614b8d565b60405180910390f35b6105b2612527565b005b3480156105bf575f5ffd5b506105c86126bb565b6040516105d59190614bad565b60405180910390f35b6105f860048036038101906105f39190614bc6565b6126d0565b604051610605919061482d565b60405180910390f35b348015610619575f5ffd5b50610634600480360381019061062f9190614c59565b6129ea565b005b348015610641575f5ffd5b5061065c6004803603810190610657919061452a565b612c08565b6040516106699190614bad565b60405180910390f35b34801561067d575f5ffd5b50610686612c25565b005b348015610693575f5ffd5b5061069c612c38565b6040516106a9919061482d565b60405180910390f35b3480156106bd575f5ffd5b506106c6612c3e565b6040516106d69493929190614cb6565b60405180910390f35b3480156106ea575f5ffd5b506106f3612c5c565b005b348015610700575f5ffd5b5061071b60048036038101906107169190614cf9565b612c6e565b604051610728919061482d565b60405180910390f35b34801561073c575f5ffd5b506107456130fb565b60405161075291906144e7565b60405180910390f35b348015610766575f5ffd5b5061076f613122565b60405161077c919061482d565b60405180910390f35b348015610790575f5ffd5b506107ab60048036038101906107a69190614d6a565b613128565b6040516107b8919061482d565b60405180910390f35b6107db60048036038101906107d691906148ae565b613153565b005b3480156107e8575f5ffd5b506107f1613484565b6040516107fe919061482d565b60405180910390f35b348015610812575f5ffd5b5061081b61348a565b005b348015610828575f5ffd5b50610831613671565b005b34801561083e575f5ffd5b50610859600480360381019061085491906146bf565b613938565b6040516108669190614eba565b60405180910390f35b34801561087a575f5ffd5b50610895600480360381019061089091906148ae565b613aa1565b6040516108a3929190614ef6565b60405180910390f35b3480156108b7575f5ffd5b506108d260048036038101906108cd9190614d6a565b613b37565b6040516108df919061482d565b60405180910390f35b3480156108f3575f5ffd5b506108fc613b62565b005b348015610909575f5ffd5b50610912613c7e565b60405161091f919061482d565b60405180910390f35b348015610933575f5ffd5b5061094e6004803603810190610949919061452a565b613c84565b005b34801561095b575f5ffd5b50610976600480360381019061097191906146bf565b613d6b565b005b348015610983575f5ffd5b5061098c613db4565b604051610999919061482d565b60405180910390f35b3480156109ad575f5ffd5b506109c860048036038101906109c3919061452a565b613dba565b6040516109d59190614a4b565b60405180910390f35b3480156109e9575f5ffd5b50610a0460048036038101906109ff919061452a565b613e4d565b005b610a0e613ed1565b620a000073ffffffffffffffffffffffffffffffffffffffff16637f0a3bf9858585856040518563ffffffff1660e01b8152600401610a509493929190614f57565b5f604051808303815f87803b158015610a67575f5ffd5b505af1158015610a79573d5f5f3e3d5ffd5b5050505050505050565b620a000081565b6001602052805f5260405f205f91509050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001015490806002018054610ad490614fbd565b80601f0160208091040260200160405190810160405280929190818152602001828054610b0090614fbd565b8015610b4b5780601f10610b2257610100808354040283529160200191610b4b565b820191905f5260205f20905b815481529060010190602001808311610b2e57829003601f168201915b505050505090806003015f9054906101000a900460ff1690806004015490806005015490806006015f9054906101000a900460ff16908060070154905088565b610b93613ed1565b6103e8811115610bda57806040517f2f38c6ee000000000000000000000000000000000000000000000000000000008152600401610bd1919061482d565b60405180910390fd5b806009819055507f45610d581145924dd7090a5017e5f2b1d6f42213bb2e95707ff86846bbfcb1ca81604051610c10919061482d565b60405180910390a150565b6004602052805f5260405f205f91509050805f015490806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003015490806004015490806005015490806006015490806007015f9054906101000a900460ff169080600801549080600901549080600a01549080600b015490508c565b610cc9613f58565b805f811480610cda57506005548110155b15610d11576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610dad576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016004811115610dc157610dc0614702565b5b816007015f9054906101000a900460ff166004811115610de457610de3614702565b5b14610e1b576040517f94dc143900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600b01544211610e58576040517f66ec4ee600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6003816007015f6101000a81548160ff02191690836004811115610e7f57610e7e614702565b5b02179055505f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f600a8260010154610ef99190615047565b905080826001015f828254610f0e9190615077565b92505081905550816005015f815480929190610f29906150aa565b9190505550610f5b836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff165f613f7a565b60085482600101541015610feb575f826006015f6101000a81548160ff021916908315150217905550826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f3584a4db7306d80246748a1c4bc6188505b8053684afee0c79670dade4db205c60405160405180910390a25b5f836005015411156110bf575f836001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1684600501546040516110439061511e565b5f6040518083038185875af1925050503d805f811461107d576040519150601f19603f3d011682016040523d82523d5f602084013e611082565b606091505b50509050806110bd576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f811115611189575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161110d9061511e565b5f6040518083038185875af1925050503d805f8114611147576040519150601f19603f3d011682016040523d82523d5f602084013e61114c565b606091505b5050905080611187576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff7e9b02351a3253c4d2fc01f058822791511c72929065515978606eb09279002826040516111f2919061518c565b60405180910390a2826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16857fd58f2a4e069708a89a2a10de98f25ed4b483a239586791231948ef38a39c109c60405160405180910390a35050505061126d614017565b50565b611278613f58565b805f81148061128957506005548110155b156112c0576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461135c576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f600481111561136f5761136e614702565b5b816007015f9054906101000a900460ff16600481111561139257611391614702565b5b146113c9576040517f04c0a3d500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6003816007015f6101000a81548160ff021916908360048111156113f0576113ef614702565b5b02179055505f816005015411156114c9575f816001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16826005015460405161144d9061511e565b5f6040518083038185875af1925050503d805f8114611487576040519150601f19603f3d011682016040523d82523d5f602084013e61148c565b606091505b50509050806114c7576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f73ffffffffffffffffffffffffffffffffffffffff16837fd58f2a4e069708a89a2a10de98f25ed4b483a239586791231948ef38a39c109c60405160405180910390a35050611517614017565b50565b60095481565b600b5481565b61152e613ed1565b611536613f58565b815f81148061154757506005548110155b1561157e576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8581526020019081526020015f2090506004808111156115a5576115a4614702565b5b816007015f9054906101000a900460ff1660048111156115c8576115c7614702565b5b14611608576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ff90615202565b60405180910390fd5b8215611927576003816007015f6101000a81548160ff0219169083600481111561163557611634614702565b5b02179055505f8160050154111561170e575f816001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682600501546040516116929061511e565b5f6040518083038185875af1925050503d805f81146116cc576040519150601f19603f3d011682016040523d82523d5f602084013e6116d1565b606091505b505090508061170c576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f600a82600101546117839190615047565b905080826001015f8282546117989190615077565b92505081905550816005015f8154809291906117b3906150aa565b91905055506117e5836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff165f613f7a565b5f8111156118af575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16826040516118339061511e565b5f6040518083038185875af1925050503d805f811461186d576040519150601f19603f3d011682016040523d82523d5f602084013e611872565b606091505b50509050806118ad576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff7e9b02351a3253c4d2fc01f058822791511c72929065515978606eb0927900282604051611918919061526a565b60405180910390a250506119e6565b6002816007015f6101000a81548160ff0219169083600481111561194e5761194d614702565b5b02179055505f60015f836002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090506119e4826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001613f7a565b505b837f5a87909bff68caaaaf0b3fd9c74eeccc928832f879315e5c6fb7a73612f26c0c84604051611a169190614bad565b60405180910390a25050611a28614017565b5050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16611aac576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b818160015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206002019182611afb92919061546d565b503373ffffffffffffffffffffffffffffffffffffffff167fc5eb1d386f3ae9f3483a635c4e1d91cf40f144d08daf355cb3fa2204a41f99058383604051611b4492919061553a565b60405180910390a25050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16611bd0576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff16611c53576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805f811480611c6457506005548110155b15611c9b576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611ca3614031565b5f60045f8481526020019081526020015f2090505f6004811115611cca57611cc9614702565b5b816007015f9054906101000a900460ff166004811115611ced57611cec614702565b5b14611d24576040517f04c0a3d500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b33816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001816007015f6101000a81548160ff02191690836004811115611d8d57611d8c614702565b5b021790555042816009018190555060065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2083908060018154018082558091505060019003905f5260205f20015f90919091909150553373ffffffffffffffffffffffffffffffffffffffff16837f3738a681a43a0b6a554742a08bae57e0215e8a774217dc2e7de6c9411b6d0ddc60405160405180910390a3505050565b611e4d613f58565b835f811480611e5e57506005548110155b15611e95576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8781526020019081526020015f209050806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611f31576040517fec0ea20600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016004811115611f4557611f44614702565b5b816007015f9054906101000a900460ff166004811115611f6857611f67614702565b5b14611f9f576040517f94dc143900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8481600401819055506002816007015f6101000a81548160ff02191690836004811115611fcf57611fce614702565b5b02179055504281600a01819055505f6127106009548360050154611ff3919061555c565b611ffd9190615047565b90505f8183600501546120109190615077565b90505f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f209050806004015f815480929190612066906150aa565b9190505550612076336001613f7a565b600c5f815480929190612088906150aa565b91905055505f821115612159575f846002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16836040516120dd9061511e565b5f6040518083038185875af1925050503d805f8114612117576040519150601f19603f3d011682016040523d82523d5f602084013e61211c565b606091505b5050905080612157576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b5f831115612223575f600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16846040516121a79061511e565b5f6040518083038185875af1925050503d805f81146121e1576040519150601f19603f3d011682016040523d82523d5f602084013e6121e6565b606091505b5050905080612221576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505b887f556d8e38b75e3e273793af33ddc3e1c8bc47d1cd092b52f3a239d9d1c881899789604051612253919061559d565b60405180910390a23373ffffffffffffffffffffffffffffffffffffffff16897f4dbba472101e9f148a3a5ecbe793f0ee16a7efe4bf3f8cbfab5330e1642ef955846040516122a2919061482d565b60405180910390a350505050506122b7614017565b50505050565b6122c5613ed1565b6122cd614072565b565b606060075f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2080548060200260200160405190810160405280929190818152602001828054801561235657602002820191905f5260205f20905b815481526020019060010190808311612342575b50505050509050919050565b600a5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d5481565b6123956142cc565b60015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20604051806101000160405290815f82015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820154815260200160028201805461244c90614fbd565b80601f016020809104026020016040519081016040528092919081815260200182805461247890614fbd565b80156124c35780601f1061249a576101008083540402835291602001916124c3565b820191905f5260205f20905b8154815290600101906020018083116124a657829003601f168201915b50505050508152602001600382015f9054906101000a900460ff1660ff1660ff1681526020016004820154815260200160058201548152602001600682015f9054906101000a900460ff161515151581526020016007820154815250509050919050565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166125a7576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff1661262a576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f3403612663576040517f8b87dfbb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3460015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015f8282546126b291906155b6565b92505081905550565b5f5f60149054906101000a900460ff16905090565b5f6126d9614031565b5f3403612712576040517f8b87dfbb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60055f815480929190612725906150aa565b9190505590506040518061018001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020018581526020015f5f1b81526020013481526020018481526020015f60048111156127a2576127a1614702565b5b81526020014281526020015f81526020015f81526020016002856127c6919061555c565b426127d191906155b6565b81525060045f8381526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015f6101000a81548160ff021916908360048111156128cb576128ca614702565b5b02179055506101008201518160080155610120820151816009015561014082015181600a015561016082015181600b015590505060075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081908060018154018082558091505060019003905f5260205f20015f9091909190915055600b5f815480929190612972906150aa565b919050555034600d5f82825461298891906155b6565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16817f82ceda8df44c52270b6d81f3237243f4b8923f90f8b6aeb084687785c047dd9b86346040516129d89291906155e9565b60405180910390a38091505092915050565b825f8114806129fb57506005548110155b15612a32576040517ffc5fb8d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60045f8681526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614612ace576040517fe185211d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60026004811115612ae257612ae1614702565b5b816007015f9054906101000a900460ff166004811115612b0557612b04614702565b5b1480612b45575060016004811115612b2057612b1f614702565b5b816007015f9054906101000a900460ff166004811115612b4357612b42614702565b5b145b612b84576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612b7b9061565a565b60405180910390fd5b6004816007015f6101000a81548160ff02191690836004811115612bab57612baa614702565b5b02179055503373ffffffffffffffffffffffffffffffffffffffff16857fb59122d87b9a129d9dbb8103c368a3de4e00b50a9fc86c22d48c74cca778e6708686604051612bf99291906156a4565b60405180910390a35050505050565b6002602052805f5260405f205f915054906101000a900460ff1681565b612c2d613ed1565b612c365f6140d3565b565b60035481565b5f5f5f5f600354600b54600c54600d54935093509350935090919293565b612c64613ed1565b612c6c614194565b565b5f612c77614031565b612c7f613f58565b5f4790505f620a000090505f8173ffffffffffffffffffffffffffffffffffffffff166347400c2387876040518363ffffffff1660e01b8152600401612cc692919061553a565b6040805180830381865afa158015612ce0573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612d04919061578c565b90508173ffffffffffffffffffffffffffffffffffffffff1663d3b7e04d8787846040518463ffffffff1660e01b8152600401612d43939291906157f3565b5f604051808303815f87803b158015612d5a575f5ffd5b505af1158015612d6c573d5f5f3e3d5ffd5b505050505f4790505f8482612d819190615077565b90505f8111612dc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612dbc9061586d565b60405180910390fd5b5f60055f815480929190612dd8906150aa565b9190505590506040518061018001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020018c81526020015f5f1b81526020018381526020018b81526020015f6004811115612e5557612e54614702565b5b81526020014281526020015f81526020015f815260200160028c612e79919061555c565b42612e8491906155b6565b81525060045f8381526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015f6101000a81548160ff02191690836004811115612f7e57612f7d614702565b5b02179055506101008201518160080155610120820151816009015561014082015181600a015561016082015181600b015590505060075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081908060018154018082558091505060019003905f5260205f20015f9091909190915055600b5f815480929190613025906150aa565b919050555081600d5f82825461303b91906155b6565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16817fd78fa691ce29993622e854349fb124a4ef0cad764f67487c9a0f3b381f6dee0a8d604051613089919061559d565b60405180910390a33373ffffffffffffffffffffffffffffffffffffffff16817f82ceda8df44c52270b6d81f3237243f4b8923f90f8b6aeb084687785c047dd9b8d856040516130da9291906155e9565b60405180910390a38096505050505050506130f3614017565b949350505050565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600c5481565b6006602052815f5260405f208181548110613141575f80fd5b905f5260205f20015f91509150505481565b61315b614031565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16156131dc576040517f3a81d6fc00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60085434101561322757346008546040517f45be0a2600000000000000000000000000000000000000000000000000000000815260040161321e92919061588b565b60405180910390fd5b6040518061010001604052803373ffffffffffffffffffffffffffffffffffffffff16815260200134815260200183838080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f820116905080830192505050505050508152602001603260ff1681526020015f81526020015f81526020016001151581526020014281525060015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201908161336191906158b2565b506060820151816003015f6101000a81548160ff021916908360ff1602179055506080820151816004015560a0820151816005015560c0820151816006015f6101000a81548160ff02191690831515021790555060e08201518160070155905050600160025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555060035f815480929190613429906150aa565b91905055503373ffffffffffffffffffffffffffffffffffffffff167f79fda11c69e0429d87cf53e6967d16c56a3d80a7e6e67dd03ccf7f20d6285fc034848460405161347893929190615981565b60405180910390a25050565b60055481565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1661350a576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60085460015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015410156135d55760015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20600101546008546040517f45be0a260000000000000000000000000000000000000000000000000000000081526004016135cc92919061588b565b60405180910390fd5b6001805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f8b618344327d585386a081c7767b76c59d001736d6299027a0367fcdea17e75060405160405180910390a2565b613679613f58565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166136f9576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f9054906101000a900460ff161561377d576040517f8017c96b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206001015490505f81036137fa576040517fd0d04f6000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20600101819055505f3373ffffffffffffffffffffffffffffffffffffffff16826040516138649061511e565b5f6040518083038185875af1925050503d805f811461389e576040519150601f19603f3d011682016040523d82523d5f602084013e6138a3565b606091505b50509050806138de576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f8108595eb6bad3acefa9da467d90cc2217686d5c5ac85460f8b7849c840645fc83604051613924919061482d565b60405180910390a25050613936614017565b565b613940614325565b60045f8381526020019081526020015f20604051806101800160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820154815260200160068201548152602001600782015f9054906101000a900460ff166004811115613a5c57613a5b614702565b5b6004811115613a6e57613a6d614702565b5b81526020016008820154815260200160098201548152602001600a8201548152602001600b820154815250509050919050565b5f5f5f620a000073ffffffffffffffffffffffffffffffffffffffff166347400c2386866040518363ffffffff1660e01b8152600401613ae292919061553a565b6040805180830381865afa158015613afc573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613b20919061578c565b9050805f0151816020015192509250509250929050565b6007602052815f5260405f208181548110613b50575f80fd5b905f5260205f20015f91509150505481565b60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16613be2576040517f3480e2b200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206006015f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f3584a4db7306d80246748a1c4bc6188505b8053684afee0c79670dade4db205c60405160405180910390a2565b61271081565b613c8c613ed1565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603613cf1576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600a5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f7a7b5a0a132f9e0581eb8527f66eae9ee89c2a3e79d4ac7e41a1f1f4d48a7fc281604051613d6091906144e7565b60405180910390a150565b613d73613ed1565b806008819055507f47ab46f2c8d4258304a2f5551c1cbdb6981be49631365d1ba7191288a73f39ef81604051613da9919061482d565b60405180910390a150565b60085481565b606060065f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20805480602002602001604051908101604052809291908181526020018280548015613e4157602002820191905f5260205f20905b815481526020019060010190808311613e2d575b50505050509050919050565b613e55613ed1565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603613ec5575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401613ebc91906144e7565b60405180910390fd5b613ece816140d3565b50565b613ed96141f6565b73ffffffffffffffffffffffffffffffffffffffff16613ef76130fb565b73ffffffffffffffffffffffffffffffffffffffff1614613f5657613f1a6141f6565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401613f4d91906144e7565b60405180910390fd5b565b613f606141fd565b6002613f72613f6d61423e565b614267565b5f0181905550565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f81600501548260040154613fcf91906155b6565b90505f811115614011578060648360040154613feb919061555c565b613ff59190615047565b826003015f6101000a81548160ff021916908360ff1602179055505b50505050565b600161402961402461423e565b614267565b5f0181905550565b6140396126bb565b15614070576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b61407a614270565b5f5f60146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6140bc6141f6565b6040516140c991906144e7565b60405180910390a1565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61419c614031565b60015f60146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586141df6141f6565b6040516141ec91906144e7565b60405180910390a1565b5f33905090565b6142056142b0565b1561423c576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f005f1b905090565b5f819050919050565b6142786126bb565b6142ae576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f60026142c36142be61423e565b614267565b5f015414905090565b6040518061010001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f8152602001606081526020015f60ff1681526020015f81526020015f81526020015f151581526020015f81525090565b6040518061018001604052805f81526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f81526020015f81526020015f81526020015f81526020015f600481111561439a57614399614702565b5b81526020015f81526020015f81526020015f81526020015f81525090565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83601f8401126143ea576143e96143c9565b5b8235905067ffffffffffffffff811115614407576144066143cd565b5b602083019150836001820283011115614423576144226143d1565b5b9250929050565b5f5f5f5f60408587031215614442576144416143c1565b5b5f85013567ffffffffffffffff81111561445f5761445e6143c5565b5b61446b878288016143d5565b9450945050602085013567ffffffffffffffff81111561448e5761448d6143c5565b5b61449a878288016143d5565b925092505092959194509250565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6144d1826144a8565b9050919050565b6144e1816144c7565b82525050565b5f6020820190506144fa5f8301846144d8565b92915050565b614509816144c7565b8114614513575f5ffd5b50565b5f8135905061452481614500565b92915050565b5f6020828403121561453f5761453e6143c1565b5b5f61454c84828501614516565b91505092915050565b5f819050919050565b61456781614555565b82525050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6145af8261456d565b6145b98185614577565b93506145c9818560208601614587565b6145d281614595565b840191505092915050565b5f60ff82169050919050565b6145f2816145dd565b82525050565b5f8115159050919050565b61460c816145f8565b82525050565b5f610100820190506146265f83018b6144d8565b614633602083018a61455e565b818103604083015261464581896145a5565b905061465460608301886145e9565b614661608083018761455e565b61466e60a083018661455e565b61467b60c0830185614603565b61468860e083018461455e565b9998505050505050505050565b61469e81614555565b81146146a8575f5ffd5b50565b5f813590506146b981614695565b92915050565b5f602082840312156146d4576146d36143c1565b5b5f6146e1848285016146ab565b91505092915050565b5f819050919050565b6146fc816146ea565b82525050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b600581106147405761473f614702565b5b50565b5f8190506147508261472f565b919050565b5f61475f82614743565b9050919050565b61476f81614755565b82525050565b5f610180820190506147895f83018f61455e565b614796602083018e6144d8565b6147a3604083018d6144d8565b6147b0606083018c6146f3565b6147bd608083018b6146f3565b6147ca60a083018a61455e565b6147d760c083018961455e565b6147e460e0830188614766565b6147f261010083018761455e565b61480061012083018661455e565b61480e61014083018561455e565b61481c61016083018461455e565b9d9c50505050505050505050505050565b5f6020820190506148405f83018461455e565b92915050565b61484f816145f8565b8114614859575f5ffd5b50565b5f8135905061486a81614846565b92915050565b5f5f60408385031215614886576148856143c1565b5b5f614893858286016146ab565b92505060206148a48582860161485c565b9150509250929050565b5f5f602083850312156148c4576148c36143c1565b5b5f83013567ffffffffffffffff8111156148e1576148e06143c5565b5b6148ed858286016143d5565b92509250509250929050565b614902816146ea565b811461490c575f5ffd5b50565b5f8135905061491d816148f9565b92915050565b5f5f5f5f6060858703121561493b5761493a6143c1565b5b5f614948878288016146ab565b94505060206149598782880161490f565b935050604085013567ffffffffffffffff81111561497a576149796143c5565b5b614986878288016143d5565b925092505092959194509250565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6149c681614555565b82525050565b5f6149d783836149bd565b60208301905092915050565b5f602082019050919050565b5f6149f982614994565b614a03818561499e565b9350614a0e836149ae565b805f5b83811015614a3e578151614a2588826149cc565b9750614a30836149e3565b925050600181019050614a11565b5085935050505092915050565b5f6020820190508181035f830152614a6381846149ef565b905092915050565b614a74816144c7565b82525050565b5f82825260208201905092915050565b5f614a948261456d565b614a9e8185614a7a565b9350614aae818560208601614587565b614ab781614595565b840191505092915050565b614acb816145dd565b82525050565b614ada816145f8565b82525050565b5f61010083015f830151614af65f860182614a6b565b506020830151614b0960208601826149bd565b5060408301518482036040860152614b218282614a8a565b9150506060830151614b366060860182614ac2565b506080830151614b4960808601826149bd565b5060a0830151614b5c60a08601826149bd565b5060c0830151614b6f60c0860182614ad1565b5060e0830151614b8260e08601826149bd565b508091505092915050565b5f6020820190508181035f830152614ba58184614ae0565b905092915050565b5f602082019050614bc05f830184614603565b92915050565b5f5f60408385031215614bdc57614bdb6143c1565b5b5f614be98582860161490f565b9250506020614bfa858286016146ab565b9150509250929050565b5f5f83601f840112614c1957614c186143c9565b5b8235905067ffffffffffffffff811115614c3657614c356143cd565b5b602083019150836001820283011115614c5257614c516143d1565b5b9250929050565b5f5f5f60408486031215614c7057614c6f6143c1565b5b5f614c7d868287016146ab565b935050602084013567ffffffffffffffff811115614c9e57614c9d6143c5565b5b614caa86828701614c04565b92509250509250925092565b5f608082019050614cc95f83018761455e565b614cd6602083018661455e565b614ce3604083018561455e565b614cf0606083018461455e565b95945050505050565b5f5f5f5f60608587031215614d1157614d106143c1565b5b5f614d1e8782880161490f565b9450506020614d2f878288016146ab565b935050604085013567ffffffffffffffff811115614d5057614d4f6143c5565b5b614d5c878288016143d5565b925092505092959194509250565b5f5f60408385031215614d8057614d7f6143c1565b5b5f614d8d85828601614516565b9250506020614d9e858286016146ab565b9150509250929050565b614db1816146ea565b82525050565b614dc081614755565b82525050565b61018082015f820151614ddb5f8501826149bd565b506020820151614dee6020850182614a6b565b506040820151614e016040850182614a6b565b506060820151614e146060850182614da8565b506080820151614e276080850182614da8565b5060a0820151614e3a60a08501826149bd565b5060c0820151614e4d60c08501826149bd565b5060e0820151614e6060e0850182614db7565b50610100820151614e756101008501826149bd565b50610120820151614e8a6101208501826149bd565b50610140820151614e9f6101408501826149bd565b50610160820151614eb46101608501826149bd565b50505050565b5f61018082019050614ece5f830184614dc6565b92915050565b5f67ffffffffffffffff82169050919050565b614ef081614ed4565b82525050565b5f604082019050614f095f830185614ee7565b614f166020830184614ee7565b9392505050565b828183375f83830152505050565b5f614f368385614577565b9350614f43838584614f1d565b614f4c83614595565b840190509392505050565b5f6040820190508181035f830152614f70818688614f2b565b90508181036020830152614f85818486614f2b565b905095945050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680614fd457607f821691505b602082108103614fe757614fe6614f90565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61505182614555565b915061505c83614555565b92508261506c5761506b614fed565b5b828204905092915050565b5f61508182614555565b915061508c83614555565b92508282039050818111156150a4576150a361501a565b5b92915050565b5f6150b482614555565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036150e6576150e561501a565b5b600182019050919050565b5f81905092915050565b50565b5f6151095f836150f1565b9150615114826150fb565b5f82019050919050565b5f615128826150fe565b9150819050919050565b5f82825260208201905092915050565b7f4a6f622074696d656f75740000000000000000000000000000000000000000005f82015250565b5f615176600b83615132565b915061518182615142565b602082019050919050565b5f60408201905061519f5f83018461455e565b81810360208301526151b08161516a565b905092915050565b7f4a6f62206e6f74206469737075746564000000000000000000000000000000005f82015250565b5f6151ec601083615132565b91506151f7826151b8565b602082019050919050565b5f6020820190508181035f830152615219816151e0565b9050919050565b7f44697370757465206c6f737400000000000000000000000000000000000000005f82015250565b5f615254600c83615132565b915061525f82615220565b602082019050919050565b5f60408201905061527d5f83018461455e565b818103602083015261528e81615248565b905092915050565b5f82905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026153297fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826152ee565b61533386836152ee565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61536e61536961536484614555565b61534b565b614555565b9050919050565b5f819050919050565b61538783615354565b61539b61539382615375565b8484546152fa565b825550505050565b5f5f905090565b6153b26153a3565b6153bd81848461537e565b505050565b5b818110156153e0576153d55f826153aa565b6001810190506153c3565b5050565b601f821115615425576153f6816152cd565b6153ff846152df565b8101602085101561540e578190505b61542261541a856152df565b8301826153c2565b50505b505050565b5f82821c905092915050565b5f6154455f198460080261542a565b1980831691505092915050565b5f61545d8383615436565b9150826002028217905092915050565b6154778383615296565b67ffffffffffffffff8111156154905761548f6152a0565b5b61549a8254614fbd565b6154a58282856153e4565b5f601f8311600181146154d2575f84156154c0578287013590505b6154ca8582615452565b865550615531565b601f1984166154e0866152cd565b5f5b82811015615507578489013582556001820191506020850194506020810190506154e2565b868310156155245784890135615520601f891682615436565b8355505b6001600288020188555050505b50505050505050565b5f6020820190508181035f830152615553818486614f2b565b90509392505050565b5f61556682614555565b915061557183614555565b925082820261557f81614555565b915082820484148315176155965761559561501a565b5b5092915050565b5f6020820190506155b05f8301846146f3565b92915050565b5f6155c082614555565b91506155cb83614555565b92508282019050808211156155e3576155e261501a565b5b92915050565b5f6040820190506155fc5f8301856146f3565b615609602083018461455e565b9392505050565b7f43616e6e6f7420646973707574652074686973206a6f622073746174757300005f82015250565b5f615644601e83615132565b915061564f82615610565b602082019050919050565b5f6020820190508181035f83015261567181615638565b9050919050565b5f6156838385615132565b9350615690838584614f1d565b61569983614595565b840190509392505050565b5f6020820190508181035f8301526156bd818486615678565b90509392505050565b5f5ffd5b6156d382614595565b810181811067ffffffffffffffff821117156156f2576156f16152a0565b5b80604052505050565b5f6157046143b8565b905061571082826156ca565b919050565b61571e81614ed4565b8114615728575f5ffd5b50565b5f8151905061573981615715565b92915050565b5f60408284031215615754576157536156c6565b5b61575e60406156fb565b90505f61576d8482850161572b565b5f8301525060206157808482850161572b565b60208301525092915050565b5f604082840312156157a1576157a06143c1565b5b5f6157ae8482850161573f565b91505092915050565b6157c081614ed4565b82525050565b604082015f8201516157da5f8501826157b7565b5060208201516157ed60208501826157b7565b50505050565b5f6060820190508181035f83015261580c818587614f2b565b905061581b60208301846157c6565b949350505050565b7f58434d3a206e6f2066756e6473207265636569766564000000000000000000005f82015250565b5f615857601683615132565b915061586282615823565b602082019050919050565b5f6020820190508181035f8301526158848161584b565b9050919050565b5f60408201905061589e5f83018561455e565b6158ab602083018461455e565b9392505050565b6158bb8261456d565b67ffffffffffffffff8111156158d4576158d36152a0565b5b6158de8254614fbd565b6158e98282856153e4565b5f60209050601f83116001811461591a575f8415615908578287015190505b6159128582615452565b865550615979565b601f198416615928866152cd565b5f5b8281101561594f5784890151825560018201915060208501945060208101905061592a565b8683101561596c5784890151615968601f891682615436565b8355505b6001600288020188555050505b505050505050565b5f6040820190506159945f83018661455e565b81810360208301526159a7818486614f2b565b905094935050505056fea26469706673582212202c650318c6975216db0dc77703ee71a98e0b5f45931efe990effacbbb4fffe3464736f6c634300081c0033",
      sourceMap:
        "833:27845:27:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;16937:181;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;1421:91;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;3976:45;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;;;;;;;:::i;:::-;;;;;;;;26861:220;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;4140:35;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;21022:1534;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;19985:570;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;4501:35;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4681:31;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;23459:1529;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;11698:227;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;17732:434;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;18446:1422;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;27720:65;;;;;;;;;;;;;:::i;:::-;;25702:132;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4569:27;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4757:34;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;25364:144;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;9920:174;;;:::i;:::-;;1726:84:22;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;12517:930:27;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;22728:536;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;4027:42;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;2293:101:20;;;;;;;;;;;;;:::i;:::-;;4075:28:27;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;26090:386;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;:::i;:::-;;;;;;;;27613:61;;;;;;;;;;;;;:::i;:::-;;14863:1632;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;1638:85:20;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4718:33:27;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;4215:49;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;9075:771;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;4181:28;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;10501:411;;;;;;;;;;;;;:::i;:::-;;11046:544;;;;;;;;;;;;;:::i;:::-;;25551:101;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;17369:260;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;4294:46;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;10235:199;;;;;;;;;;;;;:::i;:::-;;1575:48;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;27337:220;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;27131:155;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;4421:39;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;25887:144;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;2543:215:20;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;16937:181:27;1531:13:20;:11;:13::i;:::-;1470:42:27::1;17064:25;;;17090:11;;17103:7;;17064:47;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;16937:181:::0;;;;:::o;1421:91::-;1470:42;1421:91;:::o;3976:45::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;26861:220::-;1531:13:20;:11;:13::i;:::-;26949:4:27::1;26937:9;:16;26933:50;;;26973:9;26962:21;;;;;;;;;;;:::i;:::-;;;;;;;;26933:50;27021:9;27004:14;:26;;;;27045:29;27064:9;27045:29;;;;;;:::i;:::-;;;;;;;;26861:220:::0;:::o;4140:35::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;21022:1534::-;3023:21:23;:19;:21::i;:::-;21106:5:27::1;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;21123:15:::2;21141:4;:11;21146:5;21141:11;;;;;;;;;;;21123:29;;21180:3;:9;;;;;;;;;;;;21166:23;;:10;:23;;;21162:49;;21198:13;;;;;;;;;;;;;;21162:49;21239:18;21225:32;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:32;;;;;;;;:::i;:::-;;;21221:61;;21266:16;;;;;;;;;;;;;;21221:61;21315:3;:12;;;21296:15;:31;21292:64;;21336:20;;;;;;;;;;;;;;21292:64;21380:16;21367:3;:10;;;:29;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;21407:25;21435:9;:23;21445:3;:12;;;;;;;;;;;;21435:23;;;;;;;;;;;;;;;21407:51;;21468:19;21514:2;21490:8;:21;;;:26;;;;:::i;:::-;21468:48;;21598:11;21573:8;:21;;;:36;;;;;;;:::i;:::-;;;;;;;;21619:8;:24;;;:26;;;;;;;;;:::i;:::-;;;;;;21655:38;21673:3;:12;;;;;;;;;;;;21687:5;21655:17;:38::i;:::-;21797:14;;21773:8;:21;;;:38;21769:146;;;21847:5;21827:8;:17;;;:25;;;;;;;;;;;;;;;;;;21891:3;:12;;;;;;;;;;;;21871:33;;;;;;;;;;;;21769:146;21973:1;21953:3;:17;;;:21;21949:215;;;21991:17;22022:3;:9;;;;;;;;;;;;22014:23;;22062:3;:17;;;22014:83;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;21990:107;;;22116:12;22111:42;;22137:16;;;;;;;;;;;;;;22111:42;21976:188;21949:215;22244:1;22230:11;:15;22226:206;;;22262:17;22293:12;;;;;;;;;;;22285:26;;22336:11;22285:80;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;22261:104;;;22384:12;22379:42;;22405:16;;;;;;;;;;;;;;22379:42;22247:185;22226:206;22463:3;:12;;;;;;;;;;;;22447:57;;;22477:11;22447:57;;;;;;:::i;:::-;;;;;;;;22536:3;:12;;;;;;;;;;;;22519:30;;22529:5;22519:30;;;;;;;;;;21113:1443;;;3054:1:23::1;3065:20:::0;:18;:20::i;:::-;21022:1534:27;:::o;19985:570::-;3023:21:23;:19;:21::i;:::-;20051:5:27::1;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;20068:15:::2;20086:4;:11;20091:5;20086:11;;;;;;;;;;;20068:29;;20125:3;:9;;;;;;;;;;;;20111:23;;:10;:23;;;20107:49;;20143:13;;;;;;;;;;;;;;20107:49;20184:17;20170:31;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:31;;;;;;;;:::i;:::-;;;20166:59;;20210:15;;;;;;;;;;;;;;20166:59;20249:16;20236:3;:10;;;:29;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;20324:1;20304:3;:17;;;:21;20300:205;;;20342:12;20368:3;:9;;;;;;;;;;;;20360:23;;20408:3;:17;;;20360:83;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;20341:102;;;20462:7;20457:37;;20478:16;;;;;;;;;;;;;;20457:37;20327:178;20300:205;20545:1;20520:28;;20530:5;20520:28;;;;;;;;;;20058:497;3054:1:23::1;3065:20:::0;:18;:20::i;:::-;19985:570:27;:::o;4501:35::-;;;;:::o;4681:31::-;;;;:::o;23459:1529::-;1531:13:20;:11;:13::i;:::-;3023:21:23::1;:19;:21::i;:::-;23578:5:27::2;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;23595:15:::3;23613:4;:11;23618:5;23613:11;;;;;;;;;;;23595:29;;23656:18;23642:32:::0;::::3;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:32;;;;;;;;:::i;:::-;;;23634:61;;;;;;;;;;;;:::i;:::-;;;;;;;;;23710:9;23706:1227;;;23748:16;23735:3;:10;;;:29;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;23831:1;23811:3;:17;;;:21;23807:225;;;23853:12;23879:3;:9;;;;;;;;;;;;23871:23;;23923:3;:17;;;23871:91;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23852:110;;;23985:7;23980:37;;24001:16;;;;;;;;;;;;;;23980:37;23834:198;23807:225;24076:25;24104:9;:23;24114:3;:12;;;;;;;;;;;;24104:23;;;;;;;;;;;;;;;24076:51;;24141:19;24187:2;24163:8;:21;;;:26;;;;:::i;:::-;24141:48;;24228:11;24203:8;:21;;;:36;;;;;;;:::i;:::-;;;;;;;;24253:8;:24;;;:26;;;;;;;;;:::i;:::-;;;;;;24293:38;24311:3;:12;;;;;;;;;;;;24325:5;24293:17;:38::i;:::-;24364:1;24350:11;:15;24346:226;;;24386:17;24417:12;;;;;;;;;;;24409:26;;24464:11;24409:88;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;24385:112;;;24520:12;24515:42;;24541:16;;;;;;;;;;;;;;24515:42;24367:205;24346:226;24607:3;:12;;;;;;;;;;;;24591:58;;;24621:11;24591:58;;;;;;:::i;:::-;;;;;;;;23721:939;;23706:1227;;;24786:19;24773:3;:10;;;:32;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;24820:25;24848:9;:23;24858:3;:12;;;;;;;;;;;;24848:23;;;;;;;;;;;;;;;24820:51;;24885:37;24903:3;:12;;;;;;;;;;;;24917:4;24885:17;:37::i;:::-;24666:267;23706:1227;24964:5;24948:33;24971:9;24948:33;;;;;;:::i;:::-;;;;;;;;23585:1403;3054:1:23::2;3065:20:::1;:18;:20::i;:::-;23459:1529:27::0;;:::o;11698:227::-;11771:10;:22;11782:10;11771:22;;;;;;;;;;;;;;;;;;;;;;;;;11766:49;;11802:13;;;;;;;;;;;;;;11766:49;11858:8;;11825:9;:21;11835:10;11825:21;;;;;;;;;;;;;;;:30;;:41;;;;;;;:::i;:::-;;11897:10;11881:37;;;11909:8;;11881:37;;;;;;;:::i;:::-;;;;;;;;11698:227;;:::o;17732:434::-;7734:10;:22;7745:10;7734:22;;;;;;;;;;;;;;;;;;;;;;;;;7729:49;;7765:13;;;;;;;;;;;;;;7729:49;7793:9;:21;7803:10;7793:21;;;;;;;;;;;;;;;:30;;;;;;;;;;;;7788:63;;7832:19;;;;;;;;;;;;;;7788:63;17818:5:::1;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;1350:19:22::2;:17;:19::i;:::-;17849:15:27::3;17867:4;:11;17872:5;17867:11;;;;;;;;;;;17849:29;;17906:17;17892:31;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:31;;;;;;;;:::i;:::-;;;17888:59;;17932:15;;;;;;;;;;;;;;17888:59;17973:10;17958:3;:12;;;:25;;;;;;;;;;;;;;;;;;18006:18;17993:3;:10;;;:31;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;18051:15;18034:3;:14;;:32;;;;18077:12;:24;18090:10;18077:24;;;;;;;;;;;;;;;18107:5;18077:36;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;18148:10;18129:30;;18141:5;18129:30;;;;;;;;;;17839:327;7861:1:::1;17732:434:::0;:::o;18446:1422::-;3023:21:23;:19;:21::i;:::-;18585:5:27::1;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;18602:15:::2;18620:4;:11;18625:5;18620:11;;;;;;;;;;;18602:29;;18659:3;:12;;;;;;;;;;;;18645:26;;:10;:26;;;18641:60;;18680:21;;;;;;;;;;;;;;18641:60;18729:18;18715:32;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:32;;;;;;;;:::i;:::-;;;18711:61;;18756:16;;;;;;;;;;;;;;18711:61;18827:9;18811:3;:13;;:25;;;;18859:19;18846:3;:10;;;:32;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;18906:15;18888:3;:15;;:33;;;;18963:11;1617:6;18998:14;;18978:3;:17;;;:34;;;;:::i;:::-;18977:54;;;;:::i;:::-;18963:68;;19041:23;19087:3;19067;:17;;;:23;;;;:::i;:::-;19041:49;;19134:25;19162:9;:21;19172:10;19162:21;;;;;;;;;;;;;;;19134:49;;19193:8;:27;;;:29;;;;;;;;;:::i;:::-;;;;;;19232:35;19250:10;19262:4;19232:17;:35::i;:::-;19305:18;;:20;;;;;;;;;:::i;:::-;;;;;;19387:1;19369:15;:19;19365:220;;;19405:20;19439:3;:12;;;;;;;;;;;;19431:26;;19482:15;19431:84;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;19404:111;;;19534:15;19529:45;;19558:16;;;;;;;;;;;;;;19529:45;19390:195;19365:220;19605:1;19599:3;:7;19595:156;;;19623:15;19652:12;;;;;;;;;;;19644:26;;19678:3;19644:42;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;19622:64;;;19705:10;19700:40;;19724:16;;;;;;;;;;;;;;19700:40;19608:143;19595:156;19781:5;19766:32;19788:9;19766:32;;;;;;:::i;:::-;;;;;;;;19833:10;19813:48;;19826:5;19813:48;19845:15;19813:48;;;;;;:::i;:::-;;;;;;;;18592:1276;;;;3054:1:23::1;3065:20:::0;:18;:20::i;:::-;18446:1422:27;;;;:::o;27720:65::-;1531:13:20;:11;:13::i;:::-;27768:10:27::1;:8;:10::i;:::-;27720:65::o:0;25702:132::-;25776:16;25811:9;:16;25821:5;25811:16;;;;;;;;;;;;;;;25804:23;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;25702:132;;;:::o;4569:27::-;;;;;;;;;;;;;:::o;4757:34::-;;;;:::o;25364:144::-;25444:15;;:::i;:::-;25478:9;:23;25488:12;25478:23;;;;;;;;;;;;;;;25471:30;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;25364:144;;;:::o;9920:174::-;7734:10;:22;7745:10;7734:22;;;;;;;;;;;;;;;;;;;;;;;;;7729:49;;7765:13;;;;;;;;;;;;;;7729:49;7793:9;:21;7803:10;7793:21;;;;;;;;;;;;;;;:30;;;;;;;;;;;;7788:63;;7832:19;;;;;;;;;;;;;;7788:63;10003:1:::1;9990:9;:14:::0;9986:44:::1;;10013:17;;;;;;;;;;;;;;9986:44;10078:9;10040;:21;10050:10;10040:21;;;;;;;;;;;;;;;:34;;;:47;;;;;;;:::i;:::-;;;;;;;;9920:174::o:0;1726:84:22:-;1773:4;1796:7;;;;;;;;;;;1789:14;;1726:84;:::o;12517:930:27:-;12637:7;1350:19:22;:17;:19::i;:::-;12673:1:27::1;12660:9;:14:::0;12656:44:::1;;12683:17;;;;;;;;;;;;;;12656:44;12711:13;12727:9;;:11;;;;;;;;;:::i;:::-;;;;;12711:27;;12763:473;;;;;;;;12788:5;12763:473;;;;12814:10;12763:473;;;;;;12856:1;12763:473;;;;;;12881:7;12763:473;;;;12921:1;12913:10;;12763:473;;;;12952:9;12763:473;;;;12989:12;12763:473;;;;13023:17;12763:473;;;;;;;;:::i;:::-;;;;;;13065:15;12763:473;;;;13106:1;12763:473;;;;13134:1;12763:473;;;;13193:1;13178:12;:16;;;;:::i;:::-;13159:15;:36;;;;:::i;:::-;12763:473;;::::0;12749:4:::1;:11;12754:5;12749:11;;;;;;;;;;;:487;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;13247:9;:21;13257:10;13247:21;;;;;;;;;;;;;;;13274:5;13247:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;13291:16;;:18;;;;;;;;;:::i;:::-;;;;;;13342:9;13319:19;;:32;;;;;;;:::i;:::-;;;;;;;;13387:10;13367:51;;13380:5;13367:51;13399:7;13408:9;13367:51;;;;;;;:::i;:::-;;;;;;;;13435:5;13428:12;;;12517:930:::0;;;;:::o;22728:536::-;22831:5;7932:1;7923:5;:10;:32;;;;7946:9;;7937:5;:18;;7923:32;7919:62;;;7964:17;;;;;;;;;;;;;;7919:62;22848:15:::1;22866:4;:11;22871:5;22866:11;;;;;;;;;;;22848:29;;22905:3;:9;;;;;;;;;;;;22891:23;;:10;:23;;;22887:49;;22923:13;;;;;;;;;;;;;;22887:49;23035:19;23021:33;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:33;;;;;;;;:::i;:::-;;;:85;;;;23088:18;23074:32;;;;;;;;:::i;:::-;;:3;:10;;;;;;;;;;;;:32;;;;;;;;:::i;:::-;;;23021:85;23000:162;;;;;;;;;;;;:::i;:::-;;;;;;;;;23186:18;23173:3;:10;;;:31;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;23238:10;23219:38;;23231:5;23219:38;23250:6;;23219:38;;;;;;;:::i;:::-;;;;;;;;22838:426;22728:536:::0;;;;:::o;4027:42::-;;;;;;;;;;;;;;;;;;;;;;:::o;2293:101:20:-;1531:13;:11;:13::i;:::-;2357:30:::1;2384:1;2357:18;:30::i;:::-;2293:101::o:0;4075:28:27:-;;;;:::o;26090:386::-;26181:22;26217:18;26249:22;26285:20;26351:13;;26378:16;;26408:18;;26440:19;;26330:139;;;;;;;;26090:386;;;;:::o;27613:61::-;1531:13:20;:11;:13::i;:::-;27659:8:27::1;:6;:8::i;:::-;27613:61::o:0;14863:1632::-;15030:7;1350:19:22;:17;:19::i;:::-;3023:21:23::1;:19;:21::i;:::-;15096::27::2;15120;15096:45;;15199:8;1470:42;15199:31;;15240:25;15268:3;:16;;;15285:10;;15268:28;;;;;;;;;;;;;;;;:::i;:::-;;::::0;::::2;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;15240:56;;15391:3;:11;;;15403:10;;15415:6;15391:31;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;15498:20;15521:21;15498:44;;15552:18;15588:13;15573:12;:28;;;;:::i;:::-;15552:49;;15632:1;15619:10;:14;15611:49;;;;;;;;;;;;:::i;:::-;;;;;;;;;15728:13;15744:9;;:11;;;;;;;;;:::i;:::-;;;;;15728:27;;15780:444;;;;;;;;15805:5;15780:444;;;;15831:10;15780:444;;;;;;15873:1;15780:444;;;;;;15898:7;15780:444;;;;15938:1;15930:10;;15780:444;;;;15969:10;15780:444;;;;16007:12;15780:444;;;;16041:17;15780:444;;;;;;;;:::i;:::-;;;;;;16083:15;15780:444;;;;16124:1;15780:444;;;;16152:1;15780:444;;;;16211:1;16196:12;:16;;;;:::i;:::-;16177:15;:36;;;;:::i;:::-;15780:444;;::::0;15766:4:::2;:11;15771:5;15766:11;;;;;;;;;;;:458;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;16235:9;:21;16245:10;16235:21;;;;;;;;;;;;;;;16262:5;16235:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;16279:16;;:18;;;;;;;;;:::i;:::-;;;;;;16330:10;16307:19;;:33;;;;;;;:::i;:::-;;;;;;;;16379:10;16356:43;;16372:5;16356:43;16391:7;16356:43;;;;;;:::i;:::-;;;;;;;;16434:10;16414:52;;16427:5;16414:52;16446:7;16455:10;16414:52;;;;;;;:::i;:::-;;;;;;;;16483:5;16476:12;;;;;;;;3065:20:23::1;:18;:20::i;:::-;14863:1632:27::0;;;;;;:::o;1638:85:20:-;1684:7;1710:6;;;;;;;;;;;1703:13;;1638:85;:::o;4718:33:27:-;;;;:::o;4215:49::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;9075:771::-;1350:19:22;:17;:19::i;:::-;9185:10:27::1;:22;9196:10;9185:22;;;;;;;;;;;;;;;;;;;;;;;;;9181:54;;;9216:19;;;;;;;;;;;;;;9181:54;9261:14;;9249:9;:26;9245:95;;;9314:9;9325:14;;9296:44;;;;;;;;;;;;:::i;:::-;;;;;;;;9245:95;9375:332;;;;;;;;9415:10;9375:332;;;;;;9453:9;9375:332;;;;9486:8;;9375:332;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;9525:2;9375:332;;;;;;9592:1;9375:332;;;;9624:1;9375:332;;;;9649:4;9375:332;;;;;;9681:15;9375:332;;::::0;9351:9:::1;:21;9361:10;9351:21;;;;;;;;;;;;;;;:356;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;9743:4;9718:10;:22;9729:10;9718:22;;;;;;;;;;;;;;;;:29;;;;;;;;;;;;;;;;;;9757:13;;:15;;;;;;;;;:::i;:::-;;;;;;9807:10;9788:51;;;9819:9;9830:8;;9788:51;;;;;;;;:::i;:::-;;;;;;;;9075:771:::0;;:::o;4181:28::-;;;;:::o;10501:411::-;10555:10;:22;10566:10;10555:22;;;;;;;;;;;;;;;;;;;;;;;;;10550:49;;10586:13;;;;;;;;;;;;;;10550:49;10650:14;;10613:9;:21;10623:10;10613:21;;;;;;;;;;;;;;;:34;;;:51;10609:204;;;10722:9;:21;10732:10;10722:21;;;;;;;;;;;;;;;:34;;;10774:14;;10687:115;;;;;;;;;;;;:::i;:::-;;;;;;;;10609:204;10855:4;10822:9;:21;10832:10;10822:21;;;;;;;;;;;;;;;:30;;;:37;;;;;;;;;;;;;;;;;;10894:10;10874:31;;;;;;;;;;;;10501:411::o;11046:544::-;3023:21:23;:19;:21::i;:::-;11108:10:27::1;:22;11119:10;11108:22;;;;;;;;;;;;;;;;;;;;;;;;;11103:49;;11139:13;;;;;;;;;;;;;;11103:49;11166:9;:21;11176:10;11166:21;;;;;;;;;;;;;;;:30;;;;;;;;;;;;11162:62;;;11205:19;;;;;;;;;;;;;;11162:62;11260:14;11277:9;:21;11287:10;11277:21;;;;;;;;;;;;;;;:34;;;11260:51;;11335:1;11325:6;:11:::0;11321:43:::1;;11345:19;;;;;;;;;;;;;;11321:43;11412:1;11375:9;:21;11385:10;11375:21;;;;;;;;;;;;;;;:34;;:38;;;;11425:12;11451:10;11443:24;;11475:6;11443:43;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;11424:62;;;11501:7;11496:37;;11517:16;;;;;;;;;;;;;;11496:37;11564:10;11549:34;;;11576:6;11549:34;;;;;;:::i;:::-;;;;;;;;11093:497;;3065:20:23::0;:18;:20::i;:::-;11046:544:27:o;25551:101::-;25605:10;;:::i;:::-;25634:4;:11;25639:5;25634:11;;;;;;;;;;;25627:18;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;25551:101;;;:::o;17369:260::-;17457:14;17473:16;17501:25;1470:42;17529:33;;;17563:7;;17529:42;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;17501:70;;17589:6;:14;;;17605:6;:16;;;17581:41;;;;;17369:260;;;;;:::o;4294:46::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;10235:199::-;10289:10;:22;10300:10;10289:22;;;;;;;;;;;;;;;;;;;;;;;;;10284:49;;10320:13;;;;;;;;;;;;;;10284:49;10376:5;10343:9;:21;10353:10;10343:21;;;;;;;;;;;;;;;:30;;;:38;;;;;;;;;;;;;;;;;;10416:10;10396:31;;;;;;;;;;;;10235:199::o;1575:48::-;1617:6;1575:48;:::o;27337:220::-;1531:13:20;:11;:13::i;:::-;27441:1:27::1;27417:26;;:12;:26;;::::0;27413:52:::1;;27452:13;;;;;;;;;;;;;;27413:52;27490:12;27475;;:27;;;;;;;;;;;;;;;;;;27517:33;27537:12;27517:33;;;;;;:::i;:::-;;;;;;;;27337:220:::0;:::o;27131:155::-;1531:13:20;:11;:13::i;:::-;27225:11:27::1;27208:14;:28;;;;27251;27267:11;27251:28;;;;;;:::i;:::-;;;;;;;;27131:155:::0;:::o;4421:39::-;;;;:::o;25887:144::-;25967:16;26002:12;:22;26015:8;26002:22;;;;;;;;;;;;;;;25995:29;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;25887:144;;;:::o;2543:215:20:-;1531:13;:11;:13::i;:::-;2647:1:::1;2627:22;;:8;:22;;::::0;2623:91:::1;;2700:1;2672:31;;;;;;;;;;;:::i;:::-;;;;;;;;2623:91;2723:28;2742:8;2723:18;:28::i;:::-;2543:215:::0;:::o;1796:162::-;1866:12;:10;:12::i;:::-;1855:23;;:7;:5;:7::i;:::-;:23;;;1851:101;;1928:12;:10;:12::i;:::-;1901:40;;;;;;;;;;;:::i;:::-;;;;;;;;1851:101;1796:162::o;3749:292:23:-;3872:25;:23;:25::i;:::-;2407:1;3972:46;:29;:27;:29::i;:::-;:44;:46::i;:::-;:52;;:62;;;;3749:292::o;28247:312:27:-;28329:18;28350:9;:23;28360:12;28350:23;;;;;;;;;;;;;;;28329:44;;28383:13;28422:1;:17;;;28399:1;:20;;;:40;;;;:::i;:::-;28383:56;;28462:1;28454:5;:9;28450:103;;;28536:5;28529:3;28506:1;:20;;;:26;;;;:::i;:::-;28505:36;;;;:::i;:::-;28479:1;:17;;;:63;;;;;;;;;;;;;;;;;;28450:103;28319:240;;28247:312;;:::o;4047:253:23:-;2365:1;4227:46;:29;:27;:29::i;:::-;:44;:46::i;:::-;:52;;:66;;;;4047:253::o;1878:128:22:-;1943:8;:6;:8::i;:::-;1939:61;;;1974:15;;;;;;;;;;;;;;1939:61;1878:128::o;2586:117::-;1597:16;:14;:16::i;:::-;2654:5:::1;2644:7;;:15;;;;;;;;;;;;;;;;;;2674:22;2683:12;:10;:12::i;:::-;2674:22;;;;;;:::i;:::-;;;;;;;;2586:117::o:0;2912:187:20:-;2985:16;3004:6;;;;;;;;;;;2985:25;;3029:8;3020:6;;:17;;;;;;;;;;;;;;;;;;3083:8;3052:40;;3073:8;3052:40;;;;;;;;;;;;2975:124;2912:187;:::o;2339:115:22:-;1350:19;:17;:19::i;:::-;2408:4:::1;2398:7;;:14;;;;;;;;;;;;;;;;;;2427:20;2434:12;:10;:12::i;:::-;2427:20;;;;;;:::i;:::-;;;;;;;;2339:115::o:0;656:96:21:-;709:7;735:10;728:17;;656:96;:::o;3586:157:23:-;3648:25;:23;:25::i;:::-;3644:93;;;3696:30;;;;;;;;;;;;;;3644:93;3586:157::o;4636:127::-;4706:7;1505:66;4732:24;;4725:31;;4636:127;:::o;2679:163:24:-;2740:21;2822:4;2812:14;;2679:163;;;:::o;2078:126:22:-;2141:8;:6;:8::i;:::-;2136:62;;2172:15;;;;;;;;;;;;;;2136:62;2078:126::o;4479:151:23:-;4537:4;2407:1;4560:46;:29;:27;:29::i;:::-;:44;:46::i;:::-;:52;;;:63;4553:70;;4479:151;:::o;-1:-1:-1:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;7:75:30:-;40:6;73:2;67:9;57:19;;7:75;:::o;88:117::-;197:1;194;187:12;211:117;320:1;317;310:12;334:117;443:1;440;433:12;457:117;566:1;563;556:12;580:117;689:1;686;679:12;716:552;773:8;783:6;833:3;826:4;818:6;814:17;810:27;800:122;;841:79;;:::i;:::-;800:122;954:6;941:20;931:30;;984:18;976:6;973:30;970:117;;;1006:79;;:::i;:::-;970:117;1120:4;1112:6;1108:17;1096:29;;1174:3;1166:4;1158:6;1154:17;1144:8;1140:32;1137:41;1134:128;;;1181:79;;:::i;:::-;1134:128;716:552;;;;;:::o;1274:870::-;1364:6;1372;1380;1388;1437:2;1425:9;1416:7;1412:23;1408:32;1405:119;;;1443:79;;:::i;:::-;1405:119;1591:1;1580:9;1576:17;1563:31;1621:18;1613:6;1610:30;1607:117;;;1643:79;;:::i;:::-;1607:117;1756:64;1812:7;1803:6;1792:9;1788:22;1756:64;:::i;:::-;1738:82;;;;1534:296;1897:2;1886:9;1882:18;1869:32;1928:18;1920:6;1917:30;1914:117;;;1950:79;;:::i;:::-;1914:117;2063:64;2119:7;2110:6;2099:9;2095:22;2063:64;:::i;:::-;2045:82;;;;1840:297;1274:870;;;;;;;:::o;2150:126::-;2187:7;2227:42;2220:5;2216:54;2205:65;;2150:126;;;:::o;2282:96::-;2319:7;2348:24;2366:5;2348:24;:::i;:::-;2337:35;;2282:96;;;:::o;2384:118::-;2471:24;2489:5;2471:24;:::i;:::-;2466:3;2459:37;2384:118;;:::o;2508:222::-;2601:4;2639:2;2628:9;2624:18;2616:26;;2652:71;2720:1;2709:9;2705:17;2696:6;2652:71;:::i;:::-;2508:222;;;;:::o;2736:122::-;2809:24;2827:5;2809:24;:::i;:::-;2802:5;2799:35;2789:63;;2848:1;2845;2838:12;2789:63;2736:122;:::o;2864:139::-;2910:5;2948:6;2935:20;2926:29;;2964:33;2991:5;2964:33;:::i;:::-;2864:139;;;;:::o;3009:329::-;3068:6;3117:2;3105:9;3096:7;3092:23;3088:32;3085:119;;;3123:79;;:::i;:::-;3085:119;3243:1;3268:53;3313:7;3304:6;3293:9;3289:22;3268:53;:::i;:::-;3258:63;;3214:117;3009:329;;;;:::o;3344:77::-;3381:7;3410:5;3399:16;;3344:77;;;:::o;3427:118::-;3514:24;3532:5;3514:24;:::i;:::-;3509:3;3502:37;3427:118;;:::o;3551:98::-;3602:6;3636:5;3630:12;3620:22;;3551:98;;;:::o;3655:168::-;3738:11;3772:6;3767:3;3760:19;3812:4;3807:3;3803:14;3788:29;;3655:168;;;;:::o;3829:139::-;3918:6;3913:3;3908;3902:23;3959:1;3950:6;3945:3;3941:16;3934:27;3829:139;;;:::o;3974:102::-;4015:6;4066:2;4062:7;4057:2;4050:5;4046:14;4042:28;4032:38;;3974:102;;;:::o;4082:373::-;4168:3;4196:38;4228:5;4196:38;:::i;:::-;4250:70;4313:6;4308:3;4250:70;:::i;:::-;4243:77;;4329:65;4387:6;4382:3;4375:4;4368:5;4364:16;4329:65;:::i;:::-;4419:29;4441:6;4419:29;:::i;:::-;4414:3;4410:39;4403:46;;4172:283;4082:373;;;;:::o;4461:86::-;4496:7;4536:4;4529:5;4525:16;4514:27;;4461:86;;;:::o;4553:112::-;4636:22;4652:5;4636:22;:::i;:::-;4631:3;4624:35;4553:112;;:::o;4671:90::-;4705:7;4748:5;4741:13;4734:21;4723:32;;4671:90;;;:::o;4767:109::-;4848:21;4863:5;4848:21;:::i;:::-;4843:3;4836:34;4767:109;;:::o;4882:1064::-;5179:4;5217:3;5206:9;5202:19;5194:27;;5231:71;5299:1;5288:9;5284:17;5275:6;5231:71;:::i;:::-;5312:72;5380:2;5369:9;5365:18;5356:6;5312:72;:::i;:::-;5431:9;5425:4;5421:20;5416:2;5405:9;5401:18;5394:48;5459:76;5530:4;5521:6;5459:76;:::i;:::-;5451:84;;5545:68;5609:2;5598:9;5594:18;5585:6;5545:68;:::i;:::-;5623:73;5691:3;5680:9;5676:19;5667:6;5623:73;:::i;:::-;5706;5774:3;5763:9;5759:19;5750:6;5706:73;:::i;:::-;5789:67;5851:3;5840:9;5836:19;5827:6;5789:67;:::i;:::-;5866:73;5934:3;5923:9;5919:19;5910:6;5866:73;:::i;:::-;4882:1064;;;;;;;;;;;:::o;5952:122::-;6025:24;6043:5;6025:24;:::i;:::-;6018:5;6015:35;6005:63;;6064:1;6061;6054:12;6005:63;5952:122;:::o;6080:139::-;6126:5;6164:6;6151:20;6142:29;;6180:33;6207:5;6180:33;:::i;:::-;6080:139;;;;:::o;6225:329::-;6284:6;6333:2;6321:9;6312:7;6308:23;6304:32;6301:119;;;6339:79;;:::i;:::-;6301:119;6459:1;6484:53;6529:7;6520:6;6509:9;6505:22;6484:53;:::i;:::-;6474:63;;6430:117;6225:329;;;;:::o;6560:77::-;6597:7;6626:5;6615:16;;6560:77;;;:::o;6643:118::-;6730:24;6748:5;6730:24;:::i;:::-;6725:3;6718:37;6643:118;;:::o;6767:180::-;6815:77;6812:1;6805:88;6912:4;6909:1;6902:15;6936:4;6933:1;6926:15;6953:120;7041:1;7034:5;7031:12;7021:46;;7047:18;;:::i;:::-;7021:46;6953:120;:::o;7079:141::-;7131:7;7160:5;7149:16;;7166:48;7208:5;7166:48;:::i;:::-;7079:141;;;:::o;7226:::-;7289:9;7322:39;7355:5;7322:39;:::i;:::-;7309:52;;7226:141;;;:::o;7373:157::-;7473:50;7517:5;7473:50;:::i;:::-;7468:3;7461:63;7373:157;;:::o;7536:1471::-;7952:4;7990:3;7979:9;7975:19;7967:27;;8004:71;8072:1;8061:9;8057:17;8048:6;8004:71;:::i;:::-;8085:72;8153:2;8142:9;8138:18;8129:6;8085:72;:::i;:::-;8167;8235:2;8224:9;8220:18;8211:6;8167:72;:::i;:::-;8249;8317:2;8306:9;8302:18;8293:6;8249:72;:::i;:::-;8331:73;8399:3;8388:9;8384:19;8375:6;8331:73;:::i;:::-;8414;8482:3;8471:9;8467:19;8458:6;8414:73;:::i;:::-;8497;8565:3;8554:9;8550:19;8541:6;8497:73;:::i;:::-;8580:86;8661:3;8650:9;8646:19;8637:6;8580:86;:::i;:::-;8676:73;8744:3;8733:9;8729:19;8720:6;8676:73;:::i;:::-;8759;8827:3;8816:9;8812:19;8803:6;8759:73;:::i;:::-;8842:74;8911:3;8900:9;8896:19;8886:7;8842:74;:::i;:::-;8926;8995:3;8984:9;8980:19;8970:7;8926:74;:::i;:::-;7536:1471;;;;;;;;;;;;;;;:::o;9013:222::-;9106:4;9144:2;9133:9;9129:18;9121:26;;9157:71;9225:1;9214:9;9210:17;9201:6;9157:71;:::i;:::-;9013:222;;;;:::o;9241:116::-;9311:21;9326:5;9311:21;:::i;:::-;9304:5;9301:32;9291:60;;9347:1;9344;9337:12;9291:60;9241:116;:::o;9363:133::-;9406:5;9444:6;9431:20;9422:29;;9460:30;9484:5;9460:30;:::i;:::-;9363:133;;;;:::o;9502:468::-;9567:6;9575;9624:2;9612:9;9603:7;9599:23;9595:32;9592:119;;;9630:79;;:::i;:::-;9592:119;9750:1;9775:53;9820:7;9811:6;9800:9;9796:22;9775:53;:::i;:::-;9765:63;;9721:117;9877:2;9903:50;9945:7;9936:6;9925:9;9921:22;9903:50;:::i;:::-;9893:60;;9848:115;9502:468;;;;;:::o;9976:527::-;10046:6;10054;10103:2;10091:9;10082:7;10078:23;10074:32;10071:119;;;10109:79;;:::i;:::-;10071:119;10257:1;10246:9;10242:17;10229:31;10287:18;10279:6;10276:30;10273:117;;;10309:79;;:::i;:::-;10273:117;10422:64;10478:7;10469:6;10458:9;10454:22;10422:64;:::i;:::-;10404:82;;;;10200:296;9976:527;;;;;:::o;10509:122::-;10582:24;10600:5;10582:24;:::i;:::-;10575:5;10572:35;10562:63;;10621:1;10618;10611:12;10562:63;10509:122;:::o;10637:139::-;10683:5;10721:6;10708:20;10699:29;;10737:33;10764:5;10737:33;:::i;:::-;10637:139;;;;:::o;10782:817::-;10870:6;10878;10886;10894;10943:2;10931:9;10922:7;10918:23;10914:32;10911:119;;;10949:79;;:::i;:::-;10911:119;11069:1;11094:53;11139:7;11130:6;11119:9;11115:22;11094:53;:::i;:::-;11084:63;;11040:117;11196:2;11222:53;11267:7;11258:6;11247:9;11243:22;11222:53;:::i;:::-;11212:63;;11167:118;11352:2;11341:9;11337:18;11324:32;11383:18;11375:6;11372:30;11369:117;;;11405:79;;:::i;:::-;11369:117;11518:64;11574:7;11565:6;11554:9;11550:22;11518:64;:::i;:::-;11500:82;;;;11295:297;10782:817;;;;;;;:::o;11605:114::-;11672:6;11706:5;11700:12;11690:22;;11605:114;;;:::o;11725:184::-;11824:11;11858:6;11853:3;11846:19;11898:4;11893:3;11889:14;11874:29;;11725:184;;;;:::o;11915:132::-;11982:4;12005:3;11997:11;;12035:4;12030:3;12026:14;12018:22;;11915:132;;;:::o;12053:108::-;12130:24;12148:5;12130:24;:::i;:::-;12125:3;12118:37;12053:108;;:::o;12167:179::-;12236:10;12257:46;12299:3;12291:6;12257:46;:::i;:::-;12335:4;12330:3;12326:14;12312:28;;12167:179;;;;:::o;12352:113::-;12422:4;12454;12449:3;12445:14;12437:22;;12352:113;;;:::o;12501:732::-;12620:3;12649:54;12697:5;12649:54;:::i;:::-;12719:86;12798:6;12793:3;12719:86;:::i;:::-;12712:93;;12829:56;12879:5;12829:56;:::i;:::-;12908:7;12939:1;12924:284;12949:6;12946:1;12943:13;12924:284;;;13025:6;13019:13;13052:63;13111:3;13096:13;13052:63;:::i;:::-;13045:70;;13138:60;13191:6;13138:60;:::i;:::-;13128:70;;12984:224;12971:1;12968;12964:9;12959:14;;12924:284;;;12928:14;13224:3;13217:10;;12625:608;;;12501:732;;;;:::o;13239:373::-;13382:4;13420:2;13409:9;13405:18;13397:26;;13469:9;13463:4;13459:20;13455:1;13444:9;13440:17;13433:47;13497:108;13600:4;13591:6;13497:108;:::i;:::-;13489:116;;13239:373;;;;:::o;13618:108::-;13695:24;13713:5;13695:24;:::i;:::-;13690:3;13683:37;13618:108;;:::o;13732:158::-;13805:11;13839:6;13834:3;13827:19;13879:4;13874:3;13870:14;13855:29;;13732:158;;;;:::o;13896:353::-;13972:3;14000:38;14032:5;14000:38;:::i;:::-;14054:60;14107:6;14102:3;14054:60;:::i;:::-;14047:67;;14123:65;14181:6;14176:3;14169:4;14162:5;14158:16;14123:65;:::i;:::-;14213:29;14235:6;14213:29;:::i;:::-;14208:3;14204:39;14197:46;;13976:273;13896:353;;;;:::o;14255:102::-;14328:22;14344:5;14328:22;:::i;:::-;14323:3;14316:35;14255:102;;:::o;14363:99::-;14434:21;14449:5;14434:21;:::i;:::-;14429:3;14422:34;14363:99;;:::o;14550:1715::-;14673:3;14709:6;14704:3;14700:16;14809:4;14802:5;14798:16;14792:23;14828:63;14885:4;14880:3;14876:14;14862:12;14828:63;:::i;:::-;14726:175;14991:4;14984:5;14980:16;14974:23;15010:63;15067:4;15062:3;15058:14;15044:12;15010:63;:::i;:::-;14911:172;15169:4;15162:5;15158:16;15152:23;15222:3;15216:4;15212:14;15205:4;15200:3;15196:14;15189:38;15248:71;15314:4;15300:12;15248:71;:::i;:::-;15240:79;;15093:237;15423:4;15416:5;15412:16;15406:23;15442:59;15495:4;15490:3;15486:14;15472:12;15442:59;:::i;:::-;15340:171;15607:4;15600:5;15596:16;15590:23;15626:63;15683:4;15678:3;15674:14;15660:12;15626:63;:::i;:::-;15521:178;15792:4;15785:5;15781:16;15775:23;15811:63;15868:4;15863:3;15859:14;15845:12;15811:63;:::i;:::-;15709:175;15970:4;15963:5;15959:16;15953:23;15989:57;16040:4;16035:3;16031:14;16017:12;15989:57;:::i;:::-;15894:162;16146:4;16139:5;16135:16;16129:23;16165:63;16222:4;16217:3;16213:14;16199:12;16165:63;:::i;:::-;16066:172;16255:4;16248:11;;14678:1587;14550:1715;;;;:::o;16271:381::-;16418:4;16456:2;16445:9;16441:18;16433:26;;16505:9;16499:4;16495:20;16491:1;16480:9;16476:17;16469:47;16533:112;16640:4;16631:6;16533:112;:::i;:::-;16525:120;;16271:381;;;;:::o;16658:210::-;16745:4;16783:2;16772:9;16768:18;16760:26;;16796:65;16858:1;16847:9;16843:17;16834:6;16796:65;:::i;:::-;16658:210;;;;:::o;16874:474::-;16942:6;16950;16999:2;16987:9;16978:7;16974:23;16970:32;16967:119;;;17005:79;;:::i;:::-;16967:119;17125:1;17150:53;17195:7;17186:6;17175:9;17171:22;17150:53;:::i;:::-;17140:63;;17096:117;17252:2;17278:53;17323:7;17314:6;17303:9;17299:22;17278:53;:::i;:::-;17268:63;;17223:118;16874:474;;;;;:::o;17368:553::-;17426:8;17436:6;17486:3;17479:4;17471:6;17467:17;17463:27;17453:122;;17494:79;;:::i;:::-;17453:122;17607:6;17594:20;17584:30;;17637:18;17629:6;17626:30;17623:117;;;17659:79;;:::i;:::-;17623:117;17773:4;17765:6;17761:17;17749:29;;17827:3;17819:4;17811:6;17807:17;17797:8;17793:32;17790:41;17787:128;;;17834:79;;:::i;:::-;17787:128;17368:553;;;;;:::o;17927:674::-;18007:6;18015;18023;18072:2;18060:9;18051:7;18047:23;18043:32;18040:119;;;18078:79;;:::i;:::-;18040:119;18198:1;18223:53;18268:7;18259:6;18248:9;18244:22;18223:53;:::i;:::-;18213:63;;18169:117;18353:2;18342:9;18338:18;18325:32;18384:18;18376:6;18373:30;18370:117;;;18406:79;;:::i;:::-;18370:117;18519:65;18576:7;18567:6;18556:9;18552:22;18519:65;:::i;:::-;18501:83;;;;18296:298;17927:674;;;;;:::o;18607:553::-;18784:4;18822:3;18811:9;18807:19;18799:27;;18836:71;18904:1;18893:9;18889:17;18880:6;18836:71;:::i;:::-;18917:72;18985:2;18974:9;18970:18;18961:6;18917:72;:::i;:::-;18999;19067:2;19056:9;19052:18;19043:6;18999:72;:::i;:::-;19081;19149:2;19138:9;19134:18;19125:6;19081:72;:::i;:::-;18607:553;;;;;;;:::o;19166:817::-;19254:6;19262;19270;19278;19327:2;19315:9;19306:7;19302:23;19298:32;19295:119;;;19333:79;;:::i;:::-;19295:119;19453:1;19478:53;19523:7;19514:6;19503:9;19499:22;19478:53;:::i;:::-;19468:63;;19424:117;19580:2;19606:53;19651:7;19642:6;19631:9;19627:22;19606:53;:::i;:::-;19596:63;;19551:118;19736:2;19725:9;19721:18;19708:32;19767:18;19759:6;19756:30;19753:117;;;19789:79;;:::i;:::-;19753:117;19902:64;19958:7;19949:6;19938:9;19934:22;19902:64;:::i;:::-;19884:82;;;;19679:297;19166:817;;;;;;;:::o;19989:474::-;20057:6;20065;20114:2;20102:9;20093:7;20089:23;20085:32;20082:119;;;20120:79;;:::i;:::-;20082:119;20240:1;20265:53;20310:7;20301:6;20290:9;20286:22;20265:53;:::i;:::-;20255:63;;20211:117;20367:2;20393:53;20438:7;20429:6;20418:9;20414:22;20393:53;:::i;:::-;20383:63;;20338:118;19989:474;;;;;:::o;20469:108::-;20546:24;20564:5;20546:24;:::i;:::-;20541:3;20534:37;20469:108;;:::o;20583:147::-;20673:50;20717:5;20673:50;:::i;:::-;20668:3;20661:63;20583:147;;:::o;20808:2327::-;20949:6;20944:3;20940:16;21039:4;21032:5;21028:16;21022:23;21058:63;21115:4;21110:3;21106:14;21092:12;21058:63;:::i;:::-;20966:165;21214:4;21207:5;21203:16;21197:23;21233:63;21290:4;21285:3;21281:14;21267:12;21233:63;:::i;:::-;21141:165;21392:4;21385:5;21381:16;21375:23;21411:63;21468:4;21463:3;21459:14;21445:12;21411:63;:::i;:::-;21316:168;21569:4;21562:5;21558:16;21552:23;21588:63;21645:4;21640:3;21636:14;21622:12;21588:63;:::i;:::-;21494:167;21748:4;21741:5;21737:16;21731:23;21767:63;21824:4;21819:3;21815:14;21801:12;21767:63;:::i;:::-;21671:169;21931:4;21924:5;21920:16;21914:23;21950:63;22007:4;22002:3;21998:14;21984:12;21950:63;:::i;:::-;21850:173;22113:4;22106:5;22102:16;22096:23;22132:63;22189:4;22184:3;22180:14;22166:12;22132:63;:::i;:::-;22033:172;22289:4;22282:5;22278:16;22272:23;22308:76;22378:4;22373:3;22369:14;22355:12;22308:76;:::i;:::-;22215:179;22481:6;22474:5;22470:18;22464:25;22502:65;22559:6;22554:3;22550:16;22536:12;22502:65;:::i;:::-;22404:173;22665:6;22658:5;22654:18;22648:25;22686:65;22743:6;22738:3;22734:16;22720:12;22686:65;:::i;:::-;22587:174;22850:6;22843:5;22839:18;22833:25;22871:65;22928:6;22923:3;22919:16;22905:12;22871:65;:::i;:::-;22771:175;23032:6;23025:5;23021:18;23015:25;23053:65;23110:6;23105:3;23101:16;23087:12;23053:65;:::i;:::-;22956:172;20918:2217;20808:2327;;:::o;23141:311::-;23278:4;23316:3;23305:9;23301:19;23293:27;;23330:115;23442:1;23431:9;23427:17;23418:6;23330:115;:::i;:::-;23141:311;;;;:::o;23458:101::-;23494:7;23534:18;23527:5;23523:30;23512:41;;23458:101;;;:::o;23565:115::-;23650:23;23667:5;23650:23;:::i;:::-;23645:3;23638:36;23565:115;;:::o;23686:324::-;23803:4;23841:2;23830:9;23826:18;23818:26;;23854:69;23920:1;23909:9;23905:17;23896:6;23854:69;:::i;:::-;23933:70;23999:2;23988:9;23984:18;23975:6;23933:70;:::i;:::-;23686:324;;;;;:::o;24016:148::-;24114:6;24109:3;24104;24091:30;24155:1;24146:6;24141:3;24137:16;24130:27;24016:148;;;:::o;24192:314::-;24288:3;24309:70;24372:6;24367:3;24309:70;:::i;:::-;24302:77;;24389:56;24438:6;24433:3;24426:5;24389:56;:::i;:::-;24470:29;24492:6;24470:29;:::i;:::-;24465:3;24461:39;24454:46;;24192:314;;;;;:::o;24512:546::-;24689:4;24727:2;24716:9;24712:18;24704:26;;24776:9;24770:4;24766:20;24762:1;24751:9;24747:17;24740:47;24804:86;24885:4;24876:6;24868;24804:86;:::i;:::-;24796:94;;24937:9;24931:4;24927:20;24922:2;24911:9;24907:18;24900:48;24965:86;25046:4;25037:6;25029;24965:86;:::i;:::-;24957:94;;24512:546;;;;;;;:::o;25064:180::-;25112:77;25109:1;25102:88;25209:4;25206:1;25199:15;25233:4;25230:1;25223:15;25250:320;25294:6;25331:1;25325:4;25321:12;25311:22;;25378:1;25372:4;25368:12;25399:18;25389:81;;25455:4;25447:6;25443:17;25433:27;;25389:81;25517:2;25509:6;25506:14;25486:18;25483:38;25480:84;;25536:18;;:::i;:::-;25480:84;25301:269;25250:320;;;:::o;25576:180::-;25624:77;25621:1;25614:88;25721:4;25718:1;25711:15;25745:4;25742:1;25735:15;25762:180;25810:77;25807:1;25800:88;25907:4;25904:1;25897:15;25931:4;25928:1;25921:15;25948:185;25988:1;26005:20;26023:1;26005:20;:::i;:::-;26000:25;;26039:20;26057:1;26039:20;:::i;:::-;26034:25;;26078:1;26068:35;;26083:18;;:::i;:::-;26068:35;26125:1;26122;26118:9;26113:14;;25948:185;;;;:::o;26139:194::-;26179:4;26199:20;26217:1;26199:20;:::i;:::-;26194:25;;26233:20;26251:1;26233:20;:::i;:::-;26228:25;;26277:1;26274;26270:9;26262:17;;26301:1;26295:4;26292:11;26289:37;;;26306:18;;:::i;:::-;26289:37;26139:194;;;;:::o;26339:233::-;26378:3;26401:24;26419:5;26401:24;:::i;:::-;26392:33;;26447:66;26440:5;26437:77;26434:103;;26517:18;;:::i;:::-;26434:103;26564:1;26557:5;26553:13;26546:20;;26339:233;;;:::o;26578:147::-;26679:11;26716:3;26701:18;;26578:147;;;;:::o;26731:114::-;;:::o;26851:398::-;27010:3;27031:83;27112:1;27107:3;27031:83;:::i;:::-;27024:90;;27123:93;27212:3;27123:93;:::i;:::-;27241:1;27236:3;27232:11;27225:18;;26851:398;;;:::o;27255:379::-;27439:3;27461:147;27604:3;27461:147;:::i;:::-;27454:154;;27625:3;27618:10;;27255:379;;;:::o;27640:169::-;27724:11;27758:6;27753:3;27746:19;27798:4;27793:3;27789:14;27774:29;;27640:169;;;;:::o;27815:161::-;27955:13;27951:1;27943:6;27939:14;27932:37;27815:161;:::o;27982:366::-;28124:3;28145:67;28209:2;28204:3;28145:67;:::i;:::-;28138:74;;28221:93;28310:3;28221:93;:::i;:::-;28339:2;28334:3;28330:12;28323:19;;27982:366;;;:::o;28354:529::-;28548:4;28586:2;28575:9;28571:18;28563:26;;28599:71;28667:1;28656:9;28652:17;28643:6;28599:71;:::i;:::-;28717:9;28711:4;28707:20;28702:2;28691:9;28687:18;28680:48;28745:131;28871:4;28745:131;:::i;:::-;28737:139;;28354:529;;;;:::o;28889:166::-;29029:18;29025:1;29017:6;29013:14;29006:42;28889:166;:::o;29061:366::-;29203:3;29224:67;29288:2;29283:3;29224:67;:::i;:::-;29217:74;;29300:93;29389:3;29300:93;:::i;:::-;29418:2;29413:3;29409:12;29402:19;;29061:366;;;:::o;29433:419::-;29599:4;29637:2;29626:9;29622:18;29614:26;;29686:9;29680:4;29676:20;29672:1;29661:9;29657:17;29650:47;29714:131;29840:4;29714:131;:::i;:::-;29706:139;;29433:419;;;:::o;29858:162::-;29998:14;29994:1;29986:6;29982:14;29975:38;29858:162;:::o;30026:366::-;30168:3;30189:67;30253:2;30248:3;30189:67;:::i;:::-;30182:74;;30265:93;30354:3;30265:93;:::i;:::-;30383:2;30378:3;30374:12;30367:19;;30026:366;;;:::o;30398:529::-;30592:4;30630:2;30619:9;30615:18;30607:26;;30643:71;30711:1;30700:9;30696:17;30687:6;30643:71;:::i;:::-;30761:9;30755:4;30751:20;30746:2;30735:9;30731:18;30724:48;30789:131;30915:4;30789:131;:::i;:::-;30781:139;;30398:529;;;;:::o;30933:96::-;30991:6;31019:3;31009:13;;30933:96;;;;:::o;31035:180::-;31083:77;31080:1;31073:88;31180:4;31177:1;31170:15;31204:4;31201:1;31194:15;31221:140;31269:4;31292:3;31284:11;;31315:3;31312:1;31305:14;31349:4;31346:1;31336:18;31328:26;;31221:140;;;:::o;31367:93::-;31404:6;31451:2;31446;31439:5;31435:14;31431:23;31421:33;;31367:93;;;:::o;31466:107::-;31510:8;31560:5;31554:4;31550:16;31529:37;;31466:107;;;;:::o;31579:393::-;31648:6;31698:1;31686:10;31682:18;31721:97;31751:66;31740:9;31721:97;:::i;:::-;31839:39;31869:8;31858:9;31839:39;:::i;:::-;31827:51;;31911:4;31907:9;31900:5;31896:21;31887:30;;31960:4;31950:8;31946:19;31939:5;31936:30;31926:40;;31655:317;;31579:393;;;;;:::o;31978:60::-;32006:3;32027:5;32020:12;;31978:60;;;:::o;32044:142::-;32094:9;32127:53;32145:34;32154:24;32172:5;32154:24;:::i;:::-;32145:34;:::i;:::-;32127:53;:::i;:::-;32114:66;;32044:142;;;:::o;32192:75::-;32235:3;32256:5;32249:12;;32192:75;;;:::o;32273:269::-;32383:39;32414:7;32383:39;:::i;:::-;32444:91;32493:41;32517:16;32493:41;:::i;:::-;32485:6;32478:4;32472:11;32444:91;:::i;:::-;32438:4;32431:105;32349:193;32273:269;;;:::o;32548:73::-;32593:3;32614:1;32607:8;;32548:73;:::o;32627:189::-;32704:32;;:::i;:::-;32745:65;32803:6;32795;32789:4;32745:65;:::i;:::-;32680:136;32627:189;;:::o;32822:186::-;32882:120;32899:3;32892:5;32889:14;32882:120;;;32953:39;32990:1;32983:5;32953:39;:::i;:::-;32926:1;32919:5;32915:13;32906:22;;32882:120;;;32822:186;;:::o;33014:541::-;33114:2;33109:3;33106:11;33103:445;;;33148:37;33179:5;33148:37;:::i;:::-;33231:29;33249:10;33231:29;:::i;:::-;33221:8;33217:44;33414:2;33402:10;33399:18;33396:49;;;33435:8;33420:23;;33396:49;33458:80;33514:22;33532:3;33514:22;:::i;:::-;33504:8;33500:37;33487:11;33458:80;:::i;:::-;33118:430;;33103:445;33014:541;;;:::o;33561:117::-;33615:8;33665:5;33659:4;33655:16;33634:37;;33561:117;;;;:::o;33684:169::-;33728:6;33761:51;33809:1;33805:6;33797:5;33794:1;33790:13;33761:51;:::i;:::-;33757:56;33842:4;33836;33832:15;33822:25;;33735:118;33684:169;;;;:::o;33858:295::-;33934:4;34080:29;34105:3;34099:4;34080:29;:::i;:::-;34072:37;;34142:3;34139:1;34135:11;34129:4;34126:21;34118:29;;33858:295;;;;:::o;34158:1398::-;34280:43;34319:3;34314;34280:43;:::i;:::-;34388:18;34380:6;34377:30;34374:56;;;34410:18;;:::i;:::-;34374:56;34454:38;34486:4;34480:11;34454:38;:::i;:::-;34539:66;34598:6;34590;34584:4;34539:66;:::i;:::-;34632:1;34661:2;34653:6;34650:14;34678:1;34673:631;;;;35348:1;35365:6;35362:84;;;35421:9;35416:3;35412:19;35399:33;35390:42;;35362:84;35472:67;35532:6;35525:5;35472:67;:::i;:::-;35466:4;35459:81;35321:229;34643:907;;34673:631;34725:4;34721:9;34713:6;34709:22;34759:36;34790:4;34759:36;:::i;:::-;34817:1;34831:215;34845:7;34842:1;34839:14;34831:215;;;34931:9;34926:3;34922:19;34909:33;34901:6;34894:49;34982:1;34974:6;34970:14;34960:24;;35029:2;35018:9;35014:18;35001:31;;34868:4;34865:1;34861:12;34856:17;;34831:215;;;35074:6;35065:7;35062:19;35059:186;;;35139:9;35134:3;35130:19;35117:33;35182:48;35224:4;35216:6;35212:17;35201:9;35182:48;:::i;:::-;35174:6;35167:64;35082:163;35059:186;35291:1;35287;35279:6;35275:14;35271:22;35265:4;35258:36;34680:624;;;34643:907;;34255:1301;;;34158:1398;;;:::o;35562:329::-;35683:4;35721:2;35710:9;35706:18;35698:26;;35770:9;35764:4;35760:20;35756:1;35745:9;35741:17;35734:47;35798:86;35879:4;35870:6;35862;35798:86;:::i;:::-;35790:94;;35562:329;;;;;:::o;35897:410::-;35937:7;35960:20;35978:1;35960:20;:::i;:::-;35955:25;;35994:20;36012:1;35994:20;:::i;:::-;35989:25;;36049:1;36046;36042:9;36071:30;36089:11;36071:30;:::i;:::-;36060:41;;36250:1;36241:7;36237:15;36234:1;36231:22;36211:1;36204:9;36184:83;36161:139;;36280:18;;:::i;:::-;36161:139;35945:362;35897:410;;;;:::o;36313:222::-;36406:4;36444:2;36433:9;36429:18;36421:26;;36457:71;36525:1;36514:9;36510:17;36501:6;36457:71;:::i;:::-;36313:222;;;;:::o;36541:191::-;36581:3;36600:20;36618:1;36600:20;:::i;:::-;36595:25;;36634:20;36652:1;36634:20;:::i;:::-;36629:25;;36677:1;36674;36670:9;36663:16;;36698:3;36695:1;36692:10;36689:36;;;36705:18;;:::i;:::-;36689:36;36541:191;;;;:::o;36738:332::-;36859:4;36897:2;36886:9;36882:18;36874:26;;36910:71;36978:1;36967:9;36963:17;36954:6;36910:71;:::i;:::-;36991:72;37059:2;37048:9;37044:18;37035:6;36991:72;:::i;:::-;36738:332;;;;;:::o;37076:180::-;37216:32;37212:1;37204:6;37200:14;37193:56;37076:180;:::o;37262:366::-;37404:3;37425:67;37489:2;37484:3;37425:67;:::i;:::-;37418:74;;37501:93;37590:3;37501:93;:::i;:::-;37619:2;37614:3;37610:12;37603:19;;37262:366;;;:::o;37634:419::-;37800:4;37838:2;37827:9;37823:18;37815:26;;37887:9;37881:4;37877:20;37873:1;37862:9;37858:17;37851:47;37915:131;38041:4;37915:131;:::i;:::-;37907:139;;37634:419;;;:::o;38083:317::-;38181:3;38202:71;38266:6;38261:3;38202:71;:::i;:::-;38195:78;;38283:56;38332:6;38327:3;38320:5;38283:56;:::i;:::-;38364:29;38386:6;38364:29;:::i;:::-;38359:3;38355:39;38348:46;;38083:317;;;;;:::o;38406:333::-;38529:4;38567:2;38556:9;38552:18;38544:26;;38616:9;38610:4;38606:20;38602:1;38591:9;38587:17;38580:47;38644:88;38727:4;38718:6;38710;38644:88;:::i;:::-;38636:96;;38406:333;;;;;:::o;38745:117::-;38854:1;38851;38844:12;38868:281;38951:27;38973:4;38951:27;:::i;:::-;38943:6;38939:40;39081:6;39069:10;39066:22;39045:18;39033:10;39030:34;39027:62;39024:88;;;39092:18;;:::i;:::-;39024:88;39132:10;39128:2;39121:22;38911:238;38868:281;;:::o;39155:129::-;39189:6;39216:20;;:::i;:::-;39206:30;;39245:33;39273:4;39265:6;39245:33;:::i;:::-;39155:129;;;:::o;39413:120::-;39485:23;39502:5;39485:23;:::i;:::-;39478:5;39475:34;39465:62;;39523:1;39520;39513:12;39465:62;39413:120;:::o;39539:141::-;39595:5;39626:6;39620:13;39611:22;;39642:32;39668:5;39642:32;:::i;:::-;39539:141;;;;:::o;39712:613::-;39797:5;39841:4;39829:9;39824:3;39820:19;39816:30;39813:117;;;39849:79;;:::i;:::-;39813:117;39948:21;39964:4;39948:21;:::i;:::-;39939:30;;40031:1;40071:59;40126:3;40117:6;40106:9;40102:22;40071:59;:::i;:::-;40064:4;40057:5;40053:16;40046:85;39979:163;40206:2;40247:59;40302:3;40293:6;40282:9;40278:22;40247:59;:::i;:::-;40240:4;40233:5;40229:16;40222:85;40152:166;39712:613;;;;:::o;40331:401::-;40426:6;40475:2;40463:9;40454:7;40450:23;40446:32;40443:119;;;40481:79;;:::i;:::-;40443:119;40601:1;40626:89;40707:7;40698:6;40687:9;40683:22;40626:89;:::i;:::-;40616:99;;40572:153;40331:401;;;;:::o;40738:105::-;40813:23;40830:5;40813:23;:::i;:::-;40808:3;40801:36;40738:105;;:::o;40897:511::-;41044:4;41039:3;41035:14;41134:4;41127:5;41123:16;41117:23;41153:61;41208:4;41203:3;41199:14;41185:12;41153:61;:::i;:::-;41059:165;41311:4;41304:5;41300:16;41294:23;41330:61;41385:4;41380:3;41376:14;41362:12;41330:61;:::i;:::-;41234:167;41013:395;40897:511;;:::o;41414:539::-;41613:4;41651:2;41640:9;41636:18;41628:26;;41700:9;41694:4;41690:20;41686:1;41675:9;41671:17;41664:47;41728:86;41809:4;41800:6;41792;41728:86;:::i;:::-;41720:94;;41824:122;41942:2;41931:9;41927:18;41918:6;41824:122;:::i;:::-;41414:539;;;;;;:::o;41959:172::-;42099:24;42095:1;42087:6;42083:14;42076:48;41959:172;:::o;42137:366::-;42279:3;42300:67;42364:2;42359:3;42300:67;:::i;:::-;42293:74;;42376:93;42465:3;42376:93;:::i;:::-;42494:2;42489:3;42485:12;42478:19;;42137:366;;;:::o;42509:419::-;42675:4;42713:2;42702:9;42698:18;42690:26;;42762:9;42756:4;42752:20;42748:1;42737:9;42733:17;42726:47;42790:131;42916:4;42790:131;:::i;:::-;42782:139;;42509:419;;;:::o;42934:332::-;43055:4;43093:2;43082:9;43078:18;43070:26;;43106:71;43174:1;43163:9;43159:17;43150:6;43106:71;:::i;:::-;43187:72;43255:2;43244:9;43240:18;43231:6;43187:72;:::i;:::-;42934:332;;;;;:::o;43272:1390::-;43387:36;43419:3;43387:36;:::i;:::-;43488:18;43480:6;43477:30;43474:56;;;43510:18;;:::i;:::-;43474:56;43554:38;43586:4;43580:11;43554:38;:::i;:::-;43639:66;43698:6;43690;43684:4;43639:66;:::i;:::-;43732:1;43756:4;43743:17;;43788:2;43780:6;43777:14;43805:1;43800:617;;;;44461:1;44478:6;44475:77;;;44527:9;44522:3;44518:19;44512:26;44503:35;;44475:77;44578:67;44638:6;44631:5;44578:67;:::i;:::-;44572:4;44565:81;44434:222;43770:886;;43800:617;43852:4;43848:9;43840:6;43836:22;43886:36;43917:4;43886:36;:::i;:::-;43944:1;43958:208;43972:7;43969:1;43966:14;43958:208;;;44051:9;44046:3;44042:19;44036:26;44028:6;44021:42;44102:1;44094:6;44090:14;44080:24;;44149:2;44138:9;44134:18;44121:31;;43995:4;43992:1;43988:12;43983:17;;43958:208;;;44194:6;44185:7;44182:19;44179:179;;;44252:9;44247:3;44243:19;44237:26;44295:48;44337:4;44329:6;44325:17;44314:9;44295:48;:::i;:::-;44287:6;44280:64;44202:156;44179:179;44404:1;44400;44392:6;44388:14;44384:22;44378:4;44371:36;43807:610;;;43770:886;;43362:1300;;;43272:1390;;:::o;44668:439::-;44817:4;44855:2;44844:9;44840:18;44832:26;;44868:71;44936:1;44925:9;44921:17;44912:6;44868:71;:::i;:::-;44986:9;44980:4;44976:20;44971:2;44960:9;44956:18;44949:48;45014:86;45095:4;45086:6;45078;45014:86;:::i;:::-;45006:94;;44668:439;;;;;;:::o",
      linkReferences: {},
    },
    methodIdentifiers: {
      "BPS_DENOMINATOR()": "e1a45218",
      "XCM_PRECOMPILE()": "077120cc",
      "addStake()": "5a627dbc",
      "assignJob(uint256)": "3c60e0b1",
      "buyerJobs(address,uint256)": "ce02dd7d",
      "cancelJob(uint256)": "1dffa3dc",
      "deactivateProvider()": "d40ab082",
      "disputeResult(uint256,string)": "5e215cf0",
      "estimateXCMWeight(bytes)": "c6371f8e",
      "feeRecipient()": "46904840",
      "getBuyerJobs(address)": "437505bf",
      "getJob(uint256)": "bf22c457",
      "getMarketplaceStats()": "812d966a",
      "getProvider(address)": "55f21eb7",
      "getProviderJobs(address)": "f2640b5e",
      "isProvider(address)": "6b074a07",
      "jobs(uint256)": "180aedf3",
      "minStakeAmount()": "f1887684",
      "nextJobId()": "b0c2aa5e",
      "owner()": "8da5cb5b",
      "pause()": "8456cb59",
      "paused()": "5c975abb",
      "platformFeeBps()": "22dcd13e",
      "providerCount()": "74c83268",
      "providerJobs(address,uint256)": "927a831b",
      "providers(address)": "0787bc27",
      "reactivateProvider()": "bd9257cf",
      "registerProvider(bytes)": "a16a7d7a",
      "renounceOwnership()": "715018a6",
      "resolveDispute(uint256,bool)": "34b25ee2",
      "sendXCMMessage(bytes,bytes)": "06e36d03",
      "setFeeRecipient(address)": "e74b981b",
      "setMinStakeAmount(uint256)": "eb4af045",
      "setPlatformFee(uint256)": "12e8e2c3",
      "slashProvider(uint256)": "1adabe0f",
      "submitJob(bytes32,uint256)": "5d3dec24",
      "submitJobWithXCM(bytes32,uint256,bytes)": "8648a5b2",
      "submitProof(uint256,bytes32,bytes)": "3dd68feb",
      "totalJobsCompleted()": "8ee0decf",
      "totalJobsCreated()": "22ef57bd",
      "totalVolumeEscrowed()": "47d4b8cc",
      "transferOwnership(address)": "f2fde38b",
      "unpause()": "3f4ba83a",
      "updateGPUSpecs(bytes)": "371ac6ce",
      "withdrawStake()": "bed9d861",
    },
    rawMetadata:
      '{"compiler":{"version":"0.8.28+commit.7893614a"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"_feeRecipient","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyRegistered","type":"error"},{"inputs":[],"name":"DeadlineNotReached","type":"error"},{"inputs":[],"name":"EnforcedPause","type":"error"},{"inputs":[],"name":"ExpectedPause","type":"error"},{"inputs":[{"internalType":"uint256","name":"sent","type":"uint256"},{"internalType":"uint256","name":"required","type":"uint256"}],"name":"InsufficientStake","type":"error"},{"inputs":[{"internalType":"uint256","name":"feeBps","type":"uint256"}],"name":"InvalidFee","type":"error"},{"inputs":[],"name":"JobDoesNotExist","type":"error"},{"inputs":[],"name":"JobNotAssigned","type":"error"},{"inputs":[],"name":"JobNotPending","type":"error"},{"inputs":[],"name":"NotAssignedProvider","type":"error"},{"inputs":[],"name":"NotJobBuyer","type":"error"},{"inputs":[],"name":"NotProvider","type":"error"},{"inputs":[],"name":"NothingToWithdraw","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"PaymentRequired","type":"error"},{"inputs":[],"name":"ProviderHasActiveJobs","type":"error"},{"inputs":[],"name":"ProviderNotActive","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"buyerWins","type":"bool"}],"name":"DisputeResolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newRecipient","type":"address"}],"name":"FeeRecipientUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"bytes","name":"newSpecs","type":"bytes"}],"name":"GPUSpecsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"}],"name":"JobAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"providerPayment","type":"uint256"}],"name":"JobCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"JobDisputed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"}],"name":"JobFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"bytes32","name":"specCID","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"JobSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMinStake","type":"uint256"}],"name":"MinStakeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFeeBps","type":"uint256"}],"name":"PlatformFeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"resultCID","type":"bytes32"}],"name":"ProofSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"}],"name":"ProviderDeactivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"}],"name":"ProviderReactivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"gpuSpecs","type":"bytes"}],"name":"ProviderRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"slashAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"ProviderSlashed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakeWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"bytes32","name":"specCID","type":"bytes32"}],"name":"XCMJobSubmitted","type":"event"},{"inputs":[],"name":"BPS_DENOMINATOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"XCM_PRECOMPILE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"addStake","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"assignJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"buyerJobs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"cancelJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deactivateProvider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"disputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"estimateXCMWeight","outputs":[{"internalType":"uint64","name":"refTime","type":"uint64"},{"internalType":"uint64","name":"proofSize","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"getBuyerJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"getJob","outputs":[{"components":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bytes32","name":"specCID","type":"bytes32"},{"internalType":"bytes32","name":"resultCID","type":"bytes32"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"computeUnits","type":"uint256"},{"internalType":"enum HyperwayMarketplace.JobStatus","name":"status","type":"uint8"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"assignedAt","type":"uint256"},{"internalType":"uint256","name":"completedAt","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct HyperwayMarketplace.Job","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketplaceStats","outputs":[{"internalType":"uint256","name":"_providerCount","type":"uint256"},{"internalType":"uint256","name":"_totalJobs","type":"uint256"},{"internalType":"uint256","name":"_completedJobs","type":"uint256"},{"internalType":"uint256","name":"_totalVolume","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"providerAddr","type":"address"}],"name":"getProvider","outputs":[{"components":[{"internalType":"address","name":"providerAddress","type":"address"},{"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"internalType":"bytes","name":"gpuSpecs","type":"bytes"},{"internalType":"uint8","name":"reputationScore","type":"uint8"},{"internalType":"uint256","name":"totalJobsCompleted","type":"uint256"},{"internalType":"uint256","name":"totalJobsFailed","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"uint256","name":"registeredAt","type":"uint256"}],"internalType":"struct HyperwayMarketplace.Provider","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"provider","type":"address"}],"name":"getProviderJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isProvider","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jobs","outputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bytes32","name":"specCID","type":"bytes32"},{"internalType":"bytes32","name":"resultCID","type":"bytes32"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"computeUnits","type":"uint256"},{"internalType":"enum HyperwayMarketplace.JobStatus","name":"status","type":"uint8"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"assignedAt","type":"uint256"},{"internalType":"uint256","name":"completedAt","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minStakeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextJobId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"platformFeeBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"providerCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"providerJobs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"providers","outputs":[{"internalType":"address","name":"providerAddress","type":"address"},{"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"internalType":"bytes","name":"gpuSpecs","type":"bytes"},{"internalType":"uint8","name":"reputationScore","type":"uint8"},{"internalType":"uint256","name":"totalJobsCompleted","type":"uint256"},{"internalType":"uint256","name":"totalJobsFailed","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"uint256","name":"registeredAt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reactivateProvider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"gpuSpecs","type":"bytes"}],"name":"registerProvider","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"bool","name":"buyerWins","type":"bool"}],"name":"resolveDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"destination","type":"bytes"},{"internalType":"bytes","name":"message","type":"bytes"}],"name":"sendXCMMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newRecipient","type":"address"}],"name":"setFeeRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newMinStake","type":"uint256"}],"name":"setMinStakeAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFeeBps","type":"uint256"}],"name":"setPlatformFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"slashProvider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"specCID","type":"bytes32"},{"internalType":"uint256","name":"computeUnits","type":"uint256"}],"name":"submitJob","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"specCID","type":"bytes32"},{"internalType":"uint256","name":"computeUnits","type":"uint256"},{"internalType":"bytes","name":"xcmMessage","type":"bytes"}],"name":"submitJobWithXCM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"bytes32","name":"resultCID","type":"bytes32"},{"internalType":"bytes","name":"proof","type":"bytes"}],"name":"submitProof","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalJobsCompleted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalJobsCreated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalVolumeEscrowed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"newSpecs","type":"bytes"}],"name":"updateGPUSpecs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],"devdoc":{"author":"Hyperway Team \\u2014 Polkadot Solidity Hackathon (Track 2)","details":"Deployed on Polkadot Hub (EVM-compatible, chain ID 420420421 mainnet / 420420417 testnet).","errors":{"EnforcedPause()":[{"details":"The operation failed because the contract is paused."}],"ExpectedPause()":[{"details":"The operation failed because the contract is not paused."}],"OwnableInvalidOwner(address)":[{"details":"The owner is not a valid owner account. (eg. `address(0)`)"}],"OwnableUnauthorizedAccount(address)":[{"details":"The caller account is not authorized to perform an operation."}],"ReentrancyGuardReentrantCall()":[{"details":"Unauthorized reentrant call."}]},"events":{"Paused(address)":{"details":"Emitted when the pause is triggered by `account`."},"Unpaused(address)":{"details":"Emitted when the pause is lifted by `account`."}},"kind":"dev","methods":{"assignJob(uint256)":{"params":{"jobId":"The job to claim"}},"cancelJob(uint256)":{"params":{"jobId":"The job to cancel"}},"constructor":{"params":{"_feeRecipient":"Address that receives platform fees and slashed collateral"}},"deactivateProvider()":{"details":"Provider can only deactivate if they have no ASSIGNED jobs"},"disputeResult(uint256,string)":{"params":{"jobId":"The job to dispute","reason":"Description of why the result is being disputed"}},"estimateXCMWeight(bytes)":{"params":{"message":"SCALE-encoded XCM V5 message"},"returns":{"proofSize":"Estimated proof size weight","refTime":"Estimated reference time weight"}},"owner()":{"details":"Returns the address of the current owner."},"paused()":{"details":"Returns true if the contract is paused, and false otherwise."},"registerProvider(bytes)":{"params":{"gpuSpecs":"JSON-encoded GPU specifications (model, VRAM, availability, etc.)"}},"renounceOwnership()":{"details":"Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."},"resolveDispute(uint256,bool)":{"params":{"buyerWins":"Whether the buyer\'s dispute is valid","jobId":"The disputed job"}},"sendXCMMessage(bytes,bytes)":{"details":"Allows the contract to dispatch cross-chain messages for:      - Returning excess funds to a parachain      - Notifying other chains of job completion      - Cross-chain governance actions (future)","params":{"destination":"SCALE-encoded MultiLocation of target chain","message":"SCALE-encoded XCM V5 message"}},"slashProvider(uint256)":{"params":{"jobId":"The job that timed out"}},"submitJob(bytes32,uint256)":{"params":{"computeUnits":"Estimated compute time in seconds","specCID":"IPFS content identifier of the job specification"},"returns":{"_0":"jobId The unique identifier for this job"}},"submitJobWithXCM(bytes32,uint256,bytes)":{"details":"Executes a SCALE-encoded XCM message via the XCM precompile.      The XCM message should encode instructions that deposit native tokens      into this contract\'s address. Typical flow:      1. Frontend constructs an XCM V5 message with instructions:         - WithdrawAsset (from buyer\'s sovereign account on source chain)         - DepositAsset  (into this contract\'s address on Polkadot Hub)      2. This function executes the XCM message via precompile      3. Checks that the contract actually received funds      4. Creates the job with escrowed payment      XCM messages MUST be VersionedXcm::V5 (prefix 0x05).","params":{"computeUnits":"Estimated compute time in seconds","specCID":"IPFS content identifier of the job specification","xcmMessage":"SCALE-encoded XCM V5 message for cross-chain token transfer"},"returns":{"_0":"jobId The unique identifier for this job"}},"submitProof(uint256,bytes32,bytes)":{"params":{"jobId":"The job that was completed","proof":"Verification proof data (challenge-response hash for MVP)","resultCID":"IPFS content identifier of the compute results"}},"transferOwnership(address)":{"details":"Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."},"updateGPUSpecs(bytes)":{"params":{"newSpecs":"New JSON-encoded GPU specifications"}},"withdrawStake()":{"details":"Provider must deactivate first and have no active jobs"}},"stateVariables":{"XCM_PRECOMPILE":{"details":"Confirmed from official Polkadot Cookbook:      https://github.com/brunopgalvao/recipe-contracts-precompile-example"}},"title":"HyperwayMarketplace","version":1},"userdoc":{"kind":"user","methods":{"BPS_DENOMINATOR()":{"notice":"Basis-point denominator (10_000 = 100%)"},"XCM_PRECOMPILE()":{"notice":"XCM precompile address on Polkadot Hub / Asset Hub"},"addStake()":{"notice":"Add more stake to an existing provider registration"},"assignJob(uint256)":{"notice":"Claim (assign) a pending job as a provider"},"cancelJob(uint256)":{"notice":"Cancel a pending job (buyer only, before it\'s assigned)"},"deactivateProvider()":{"notice":"Deactivate provider (stops receiving new jobs)"},"disputeResult(uint256,string)":{"notice":"Buyer disputes a completed job\'s result"},"estimateXCMWeight(bytes)":{"notice":"Estimate the weight of an XCM message (view function for frontend)"},"getBuyerJobs(address)":{"notice":"Get all job IDs for a buyer"},"getJob(uint256)":{"notice":"Get full job details"},"getMarketplaceStats()":{"notice":"Get aggregate marketplace statistics"},"getProvider(address)":{"notice":"Get full provider details"},"getProviderJobs(address)":{"notice":"Get all job IDs for a provider"},"pause()":{"notice":"Pause the marketplace (emergency)"},"reactivateProvider()":{"notice":"Reactivate a previously deactivated provider"},"registerProvider(bytes)":{"notice":"Register as a GPU compute provider by staking DOT collateral"},"resolveDispute(uint256,bool)":{"notice":"Owner resolves a dispute (interim solution \\u2014 DAO governance in future)"},"sendXCMMessage(bytes,bytes)":{"notice":"Send an XCM message to another chain (e.g., notify Asset Hub)"},"setFeeRecipient(address)":{"notice":"Update fee recipient address"},"setMinStakeAmount(uint256)":{"notice":"Update minimum stake amount"},"setPlatformFee(uint256)":{"notice":"Update the platform fee (max 10%)"},"slashProvider(uint256)":{"notice":"Slash a provider who failed to complete a job by the deadline"},"submitJob(bytes32,uint256)":{"notice":"Submit a new compute job with escrowed DOT payment"},"submitJobWithXCM(bytes32,uint256,bytes)":{"notice":"Submit a job using XCM cross-chain payment"},"submitProof(uint256,bytes32,bytes)":{"notice":"Submit proof of completed compute work and receive payment"},"unpause()":{"notice":"Unpause the marketplace"},"updateGPUSpecs(bytes)":{"notice":"Update GPU specifications"},"withdrawStake()":{"notice":"Withdraw staked DOT (only when deactivated)"}},"notice":"Decentralized GPU Compute Marketplace on Polkadot Hub.         Connects AI developers needing GPU compute with providers who have spare capacity.         Uses smart contract escrow, collateral staking, proof-of-compute verification,         and XCM precompiles for cross-chain payments.","version":1}},"settings":{"compilationTarget":{"src/HyperwayMarketplace.sol":"HyperwayMarketplace"},"evmVersion":"prague","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":false,"runs":200},"remappings":[":@openzeppelin/=lib/openzeppelin-contracts/",":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",":forge-std/=lib/forge-std/src/",":halmos-cheatcodes/=lib/openzeppelin-contracts/lib/halmos-cheatcodes/src/",":openzeppelin-contracts/=lib/openzeppelin-contracts/"]},"sources":{"lib/openzeppelin-contracts/contracts/access/Ownable.sol":{"keccak256":"0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb","license":"MIT","urls":["bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6","dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a"]},"lib/openzeppelin-contracts/contracts/utils/Context.sol":{"keccak256":"0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2","license":"MIT","urls":["bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12","dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF"]},"lib/openzeppelin-contracts/contracts/utils/Pausable.sol":{"keccak256":"0xdb484371dfbb848cb6f5d70464e9ac9b2900e4164ead76bbce4fef0b44bcc68f","license":"MIT","urls":["bzz-raw://f9d6f6f6600a2bec622f699081b58350873b5e63ce05464d17d674a290bb8a7c","dweb:/ipfs/QmQKVzSQY1PM3Bid4QhgVVZyx6B4Jx7XgaQzLKHj38vJz8"]},"lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol":{"keccak256":"0xa516cbf1c7d15d3517c2d668601ce016c54395bf5171918a14e2686977465f53","license":"MIT","urls":["bzz-raw://1e1d079e8edfb58efd23a311e315a4807b01b5d1cf153f8fa2d0608b9dec3e99","dweb:/ipfs/QmTBExeX2SDTkn5xbk5ssbYSx7VqRp9H4Ux1CY4uQM4b9N"]},"lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol":{"keccak256":"0xcf74f855663ce2ae00ed8352666b7935f6cddea2932fdf2c3ecd30a9b1cd0e97","license":"MIT","urls":["bzz-raw://9f660b1f351b757dfe01438e59888f31f33ded3afcf5cb5b0d9bf9aa6f320a8b","dweb:/ipfs/QmarDJ5hZEgBtCmmrVzEZWjub9769eD686jmzb2XpSU1cM"]},"src/HyperwayMarketplace.sol":{"keccak256":"0xbea0844b74f04bfec6ff554cf38a415f1b2410fc381c74cd8c0ff9c6479dc97b","license":"MIT","urls":["bzz-raw://816503649a89743efebaa82f63aa5557ea1c98d5fd23533d7d87f719440bf573","dweb:/ipfs/QmX6k8tz8gDJMwdw8uQgNd3Mc7JXy77AqNqYmwJr2wMtbe"]},"src/interfaces/IXCM.sol":{"keccak256":"0x1ac47de0dc7c2f6fb4139545283a3661561a46c4adc64853e7d00a79144066e0","license":"MIT","urls":["bzz-raw://ea92e866f7ba517ed049e72ac58b4def6cadfe482225172bae5eecb60723eac6","dweb:/ipfs/QmYdJjyqju18i1oczY91WasGYQgEnwixDtJWQNbVhuqBG8"]}},"version":1}',
    metadata: {
      compiler: { version: "0.8.28+commit.7893614a" },
      language: "Solidity",
      output: {
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_feeRecipient",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          { inputs: [], type: "error", name: "AlreadyRegistered" },
          { inputs: [], type: "error", name: "DeadlineNotReached" },
          { inputs: [], type: "error", name: "EnforcedPause" },
          { inputs: [], type: "error", name: "ExpectedPause" },
          {
            inputs: [
              { internalType: "uint256", name: "sent", type: "uint256" },
              { internalType: "uint256", name: "required", type: "uint256" },
            ],
            type: "error",
            name: "InsufficientStake",
          },
          {
            inputs: [
              { internalType: "uint256", name: "feeBps", type: "uint256" },
            ],
            type: "error",
            name: "InvalidFee",
          },
          { inputs: [], type: "error", name: "JobDoesNotExist" },
          { inputs: [], type: "error", name: "JobNotAssigned" },
          { inputs: [], type: "error", name: "JobNotPending" },
          { inputs: [], type: "error", name: "NotAssignedProvider" },
          { inputs: [], type: "error", name: "NotJobBuyer" },
          { inputs: [], type: "error", name: "NotProvider" },
          { inputs: [], type: "error", name: "NothingToWithdraw" },
          {
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
            ],
            type: "error",
            name: "OwnableInvalidOwner",
          },
          {
            inputs: [
              { internalType: "address", name: "account", type: "address" },
            ],
            type: "error",
            name: "OwnableUnauthorizedAccount",
          },
          { inputs: [], type: "error", name: "PaymentRequired" },
          { inputs: [], type: "error", name: "ProviderHasActiveJobs" },
          { inputs: [], type: "error", name: "ProviderNotActive" },
          { inputs: [], type: "error", name: "ReentrancyGuardReentrantCall" },
          { inputs: [], type: "error", name: "TransferFailed" },
          { inputs: [], type: "error", name: "ZeroAddress" },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "bool",
                name: "buyerWins",
                type: "bool",
                indexed: false,
              },
            ],
            type: "event",
            name: "DisputeResolved",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRecipient",
                type: "address",
                indexed: false,
              },
            ],
            type: "event",
            name: "FeeRecipientUpdated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
              {
                internalType: "bytes",
                name: "newSpecs",
                type: "bytes",
                indexed: false,
              },
            ],
            type: "event",
            name: "GPUSpecsUpdated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "JobAssigned",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
              {
                internalType: "uint256",
                name: "providerPayment",
                type: "uint256",
                indexed: false,
              },
            ],
            type: "event",
            name: "JobCompleted",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "buyer",
                type: "address",
                indexed: true,
              },
              {
                internalType: "string",
                name: "reason",
                type: "string",
                indexed: false,
              },
            ],
            type: "event",
            name: "JobDisputed",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "JobFailed",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "buyer",
                type: "address",
                indexed: true,
              },
              {
                internalType: "bytes32",
                name: "specCID",
                type: "bytes32",
                indexed: false,
              },
              {
                internalType: "uint256",
                name: "payment",
                type: "uint256",
                indexed: false,
              },
            ],
            type: "event",
            name: "JobSubmitted",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newMinStake",
                type: "uint256",
                indexed: false,
              },
            ],
            type: "event",
            name: "MinStakeUpdated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "previousOwner",
                type: "address",
                indexed: true,
              },
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "OwnershipTransferred",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
                indexed: false,
              },
            ],
            type: "event",
            name: "Paused",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newFeeBps",
                type: "uint256",
                indexed: false,
              },
            ],
            type: "event",
            name: "PlatformFeeUpdated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "bytes32",
                name: "resultCID",
                type: "bytes32",
                indexed: false,
              },
            ],
            type: "event",
            name: "ProofSubmitted",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "ProviderDeactivated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "ProviderReactivated",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
              {
                internalType: "uint256",
                name: "stakedAmount",
                type: "uint256",
                indexed: false,
              },
              {
                internalType: "bytes",
                name: "gpuSpecs",
                type: "bytes",
                indexed: false,
              },
            ],
            type: "event",
            name: "ProviderRegistered",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
              {
                internalType: "uint256",
                name: "slashAmount",
                type: "uint256",
                indexed: false,
              },
              {
                internalType: "string",
                name: "reason",
                type: "string",
                indexed: false,
              },
            ],
            type: "event",
            name: "ProviderSlashed",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "provider",
                type: "address",
                indexed: true,
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
                indexed: false,
              },
            ],
            type: "event",
            name: "StakeWithdrawn",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
                indexed: false,
              },
            ],
            type: "event",
            name: "Unpaused",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "buyer",
                type: "address",
                indexed: true,
              },
              {
                internalType: "bytes32",
                name: "specCID",
                type: "bytes32",
                indexed: false,
              },
            ],
            type: "event",
            name: "XCMJobSubmitted",
            anonymous: false,
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "BPS_DENOMINATOR",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "XCM_PRECOMPILE",
            outputs: [{ internalType: "address", name: "", type: "address" }],
          },
          {
            inputs: [],
            stateMutability: "payable",
            type: "function",
            name: "addStake",
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "assignJob",
          },
          {
            inputs: [
              { internalType: "address", name: "", type: "address" },
              { internalType: "uint256", name: "", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
            name: "buyerJobs",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "cancelJob",
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "deactivateProvider",
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
              { internalType: "string", name: "reason", type: "string" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "disputeResult",
          },
          {
            inputs: [{ internalType: "bytes", name: "message", type: "bytes" }],
            stateMutability: "view",
            type: "function",
            name: "estimateXCMWeight",
            outputs: [
              { internalType: "uint64", name: "refTime", type: "uint64" },
              { internalType: "uint64", name: "proofSize", type: "uint64" },
            ],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "feeRecipient",
            outputs: [{ internalType: "address", name: "", type: "address" }],
          },
          {
            inputs: [
              { internalType: "address", name: "buyer", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
            name: "getBuyerJobs",
            outputs: [
              { internalType: "uint256[]", name: "", type: "uint256[]" },
            ],
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
            name: "getJob",
            outputs: [
              {
                internalType: "struct HyperwayMarketplace.Job",
                name: "",
                type: "tuple",
                components: [
                  { internalType: "uint256", name: "jobId", type: "uint256" },
                  { internalType: "address", name: "buyer", type: "address" },
                  {
                    internalType: "address",
                    name: "provider",
                    type: "address",
                  },
                  { internalType: "bytes32", name: "specCID", type: "bytes32" },
                  {
                    internalType: "bytes32",
                    name: "resultCID",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "paymentAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "computeUnits",
                    type: "uint256",
                  },
                  {
                    internalType: "enum HyperwayMarketplace.JobStatus",
                    name: "status",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "createdAt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "assignedAt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "completedAt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256",
                  },
                ],
              },
            ],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "getMarketplaceStats",
            outputs: [
              {
                internalType: "uint256",
                name: "_providerCount",
                type: "uint256",
              },
              { internalType: "uint256", name: "_totalJobs", type: "uint256" },
              {
                internalType: "uint256",
                name: "_completedJobs",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_totalVolume",
                type: "uint256",
              },
            ],
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "providerAddr",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
            name: "getProvider",
            outputs: [
              {
                internalType: "struct HyperwayMarketplace.Provider",
                name: "",
                type: "tuple",
                components: [
                  {
                    internalType: "address",
                    name: "providerAddress",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "stakedAmount",
                    type: "uint256",
                  },
                  { internalType: "bytes", name: "gpuSpecs", type: "bytes" },
                  {
                    internalType: "uint8",
                    name: "reputationScore",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "totalJobsCompleted",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "totalJobsFailed",
                    type: "uint256",
                  },
                  { internalType: "bool", name: "isActive", type: "bool" },
                  {
                    internalType: "uint256",
                    name: "registeredAt",
                    type: "uint256",
                  },
                ],
              },
            ],
          },
          {
            inputs: [
              { internalType: "address", name: "provider", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
            name: "getProviderJobs",
            outputs: [
              { internalType: "uint256[]", name: "", type: "uint256[]" },
            ],
          },
          {
            inputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
            name: "isProvider",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
          },
          {
            inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
            name: "jobs",
            outputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
              { internalType: "address", name: "buyer", type: "address" },
              { internalType: "address", name: "provider", type: "address" },
              { internalType: "bytes32", name: "specCID", type: "bytes32" },
              { internalType: "bytes32", name: "resultCID", type: "bytes32" },
              {
                internalType: "uint256",
                name: "paymentAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "computeUnits",
                type: "uint256",
              },
              {
                internalType: "enum HyperwayMarketplace.JobStatus",
                name: "status",
                type: "uint8",
              },
              { internalType: "uint256", name: "createdAt", type: "uint256" },
              { internalType: "uint256", name: "assignedAt", type: "uint256" },
              { internalType: "uint256", name: "completedAt", type: "uint256" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "minStakeAmount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "nextJobId",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "pause",
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "paused",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "platformFeeBps",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "providerCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "address", name: "", type: "address" },
              { internalType: "uint256", name: "", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
            name: "providerJobs",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
            name: "providers",
            outputs: [
              {
                internalType: "address",
                name: "providerAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "stakedAmount",
                type: "uint256",
              },
              { internalType: "bytes", name: "gpuSpecs", type: "bytes" },
              { internalType: "uint8", name: "reputationScore", type: "uint8" },
              {
                internalType: "uint256",
                name: "totalJobsCompleted",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalJobsFailed",
                type: "uint256",
              },
              { internalType: "bool", name: "isActive", type: "bool" },
              {
                internalType: "uint256",
                name: "registeredAt",
                type: "uint256",
              },
            ],
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "reactivateProvider",
          },
          {
            inputs: [
              { internalType: "bytes", name: "gpuSpecs", type: "bytes" },
            ],
            stateMutability: "payable",
            type: "function",
            name: "registerProvider",
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "renounceOwnership",
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
              { internalType: "bool", name: "buyerWins", type: "bool" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "resolveDispute",
          },
          {
            inputs: [
              { internalType: "bytes", name: "destination", type: "bytes" },
              { internalType: "bytes", name: "message", type: "bytes" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "sendXCMMessage",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRecipient",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "setFeeRecipient",
          },
          {
            inputs: [
              { internalType: "uint256", name: "newMinStake", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "setMinStakeAmount",
          },
          {
            inputs: [
              { internalType: "uint256", name: "newFeeBps", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "setPlatformFee",
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "slashProvider",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "specCID", type: "bytes32" },
              {
                internalType: "uint256",
                name: "computeUnits",
                type: "uint256",
              },
            ],
            stateMutability: "payable",
            type: "function",
            name: "submitJob",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "bytes32", name: "specCID", type: "bytes32" },
              {
                internalType: "uint256",
                name: "computeUnits",
                type: "uint256",
              },
              { internalType: "bytes", name: "xcmMessage", type: "bytes" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "submitJobWithXCM",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "uint256", name: "jobId", type: "uint256" },
              { internalType: "bytes32", name: "resultCID", type: "bytes32" },
              { internalType: "bytes", name: "proof", type: "bytes" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "submitProof",
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "totalJobsCompleted",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "totalJobsCreated",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "totalVolumeEscrowed",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "address", name: "newOwner", type: "address" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "transferOwnership",
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "unpause",
          },
          {
            inputs: [
              { internalType: "bytes", name: "newSpecs", type: "bytes" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "updateGPUSpecs",
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "function",
            name: "withdrawStake",
          },
          { inputs: [], stateMutability: "payable", type: "receive" },
        ],
        devdoc: {
          kind: "dev",
          methods: {
            "assignJob(uint256)": { params: { jobId: "The job to claim" } },
            "cancelJob(uint256)": { params: { jobId: "The job to cancel" } },
            constructor: {
              params: {
                _feeRecipient:
                  "Address that receives platform fees and slashed collateral",
              },
            },
            "deactivateProvider()": {
              details:
                "Provider can only deactivate if they have no ASSIGNED jobs",
            },
            "disputeResult(uint256,string)": {
              params: {
                jobId: "The job to dispute",
                reason: "Description of why the result is being disputed",
              },
            },
            "estimateXCMWeight(bytes)": {
              params: { message: "SCALE-encoded XCM V5 message" },
              returns: {
                proofSize: "Estimated proof size weight",
                refTime: "Estimated reference time weight",
              },
            },
            "owner()": { details: "Returns the address of the current owner." },
            "paused()": {
              details:
                "Returns true if the contract is paused, and false otherwise.",
            },
            "registerProvider(bytes)": {
              params: {
                gpuSpecs:
                  "JSON-encoded GPU specifications (model, VRAM, availability, etc.)",
              },
            },
            "renounceOwnership()": {
              details:
                "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.",
            },
            "resolveDispute(uint256,bool)": {
              params: {
                buyerWins: "Whether the buyer's dispute is valid",
                jobId: "The disputed job",
              },
            },
            "sendXCMMessage(bytes,bytes)": {
              details:
                "Allows the contract to dispatch cross-chain messages for:      - Returning excess funds to a parachain      - Notifying other chains of job completion      - Cross-chain governance actions (future)",
              params: {
                destination: "SCALE-encoded MultiLocation of target chain",
                message: "SCALE-encoded XCM V5 message",
              },
            },
            "slashProvider(uint256)": {
              params: { jobId: "The job that timed out" },
            },
            "submitJob(bytes32,uint256)": {
              params: {
                computeUnits: "Estimated compute time in seconds",
                specCID: "IPFS content identifier of the job specification",
              },
              returns: { _0: "jobId The unique identifier for this job" },
            },
            "submitJobWithXCM(bytes32,uint256,bytes)": {
              details:
                "Executes a SCALE-encoded XCM message via the XCM precompile.      The XCM message should encode instructions that deposit native tokens      into this contract's address. Typical flow:      1. Frontend constructs an XCM V5 message with instructions:         - WithdrawAsset (from buyer's sovereign account on source chain)         - DepositAsset  (into this contract's address on Polkadot Hub)      2. This function executes the XCM message via precompile      3. Checks that the contract actually received funds      4. Creates the job with escrowed payment      XCM messages MUST be VersionedXcm::V5 (prefix 0x05).",
              params: {
                computeUnits: "Estimated compute time in seconds",
                specCID: "IPFS content identifier of the job specification",
                xcmMessage:
                  "SCALE-encoded XCM V5 message for cross-chain token transfer",
              },
              returns: { _0: "jobId The unique identifier for this job" },
            },
            "submitProof(uint256,bytes32,bytes)": {
              params: {
                jobId: "The job that was completed",
                proof:
                  "Verification proof data (challenge-response hash for MVP)",
                resultCID: "IPFS content identifier of the compute results",
              },
            },
            "transferOwnership(address)": {
              details:
                "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.",
            },
            "updateGPUSpecs(bytes)": {
              params: { newSpecs: "New JSON-encoded GPU specifications" },
            },
            "withdrawStake()": {
              details: "Provider must deactivate first and have no active jobs",
            },
          },
          version: 1,
        },
        userdoc: {
          kind: "user",
          methods: {
            "BPS_DENOMINATOR()": {
              notice: "Basis-point denominator (10_000 = 100%)",
            },
            "XCM_PRECOMPILE()": {
              notice: "XCM precompile address on Polkadot Hub / Asset Hub",
            },
            "addStake()": {
              notice: "Add more stake to an existing provider registration",
            },
            "assignJob(uint256)": {
              notice: "Claim (assign) a pending job as a provider",
            },
            "cancelJob(uint256)": {
              notice: "Cancel a pending job (buyer only, before it's assigned)",
            },
            "deactivateProvider()": {
              notice: "Deactivate provider (stops receiving new jobs)",
            },
            "disputeResult(uint256,string)": {
              notice: "Buyer disputes a completed job's result",
            },
            "estimateXCMWeight(bytes)": {
              notice:
                "Estimate the weight of an XCM message (view function for frontend)",
            },
            "getBuyerJobs(address)": { notice: "Get all job IDs for a buyer" },
            "getJob(uint256)": { notice: "Get full job details" },
            "getMarketplaceStats()": {
              notice: "Get aggregate marketplace statistics",
            },
            "getProvider(address)": { notice: "Get full provider details" },
            "getProviderJobs(address)": {
              notice: "Get all job IDs for a provider",
            },
            "pause()": { notice: "Pause the marketplace (emergency)" },
            "reactivateProvider()": {
              notice: "Reactivate a previously deactivated provider",
            },
            "registerProvider(bytes)": {
              notice:
                "Register as a GPU compute provider by staking DOT collateral",
            },
            "resolveDispute(uint256,bool)": {
              notice:
                "Owner resolves a dispute (interim solution — DAO governance in future)",
            },
            "sendXCMMessage(bytes,bytes)": {
              notice:
                "Send an XCM message to another chain (e.g., notify Asset Hub)",
            },
            "setFeeRecipient(address)": {
              notice: "Update fee recipient address",
            },
            "setMinStakeAmount(uint256)": {
              notice: "Update minimum stake amount",
            },
            "setPlatformFee(uint256)": {
              notice: "Update the platform fee (max 10%)",
            },
            "slashProvider(uint256)": {
              notice:
                "Slash a provider who failed to complete a job by the deadline",
            },
            "submitJob(bytes32,uint256)": {
              notice: "Submit a new compute job with escrowed DOT payment",
            },
            "submitJobWithXCM(bytes32,uint256,bytes)": {
              notice: "Submit a job using XCM cross-chain payment",
            },
            "submitProof(uint256,bytes32,bytes)": {
              notice:
                "Submit proof of completed compute work and receive payment",
            },
            "unpause()": { notice: "Unpause the marketplace" },
            "updateGPUSpecs(bytes)": { notice: "Update GPU specifications" },
            "withdrawStake()": {
              notice: "Withdraw staked DOT (only when deactivated)",
            },
          },
          version: 1,
        },
      },
      settings: {
        remappings: [
          "@openzeppelin/=lib/openzeppelin-contracts/",
          "erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",
          "forge-std/=lib/forge-std/src/",
          "halmos-cheatcodes/=lib/openzeppelin-contracts/lib/halmos-cheatcodes/src/",
          "openzeppelin-contracts/=lib/openzeppelin-contracts/",
        ],
        optimizer: { enabled: false, runs: 200 },
        metadata: { bytecodeHash: "ipfs" },
        compilationTarget: {
          "src/HyperwayMarketplace.sol": "HyperwayMarketplace",
        },
        evmVersion: "prague",
        libraries: {},
      },
      sources: {
        "lib/openzeppelin-contracts/contracts/access/Ownable.sol": {
          keccak256:
            "0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb",
          urls: [
            "bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6",
            "dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a",
          ],
          license: "MIT",
        },
        "lib/openzeppelin-contracts/contracts/utils/Context.sol": {
          keccak256:
            "0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2",
          urls: [
            "bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12",
            "dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF",
          ],
          license: "MIT",
        },
        "lib/openzeppelin-contracts/contracts/utils/Pausable.sol": {
          keccak256:
            "0xdb484371dfbb848cb6f5d70464e9ac9b2900e4164ead76bbce4fef0b44bcc68f",
          urls: [
            "bzz-raw://f9d6f6f6600a2bec622f699081b58350873b5e63ce05464d17d674a290bb8a7c",
            "dweb:/ipfs/QmQKVzSQY1PM3Bid4QhgVVZyx6B4Jx7XgaQzLKHj38vJz8",
          ],
          license: "MIT",
        },
        "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol": {
          keccak256:
            "0xa516cbf1c7d15d3517c2d668601ce016c54395bf5171918a14e2686977465f53",
          urls: [
            "bzz-raw://1e1d079e8edfb58efd23a311e315a4807b01b5d1cf153f8fa2d0608b9dec3e99",
            "dweb:/ipfs/QmTBExeX2SDTkn5xbk5ssbYSx7VqRp9H4Ux1CY4uQM4b9N",
          ],
          license: "MIT",
        },
        "lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol": {
          keccak256:
            "0xcf74f855663ce2ae00ed8352666b7935f6cddea2932fdf2c3ecd30a9b1cd0e97",
          urls: [
            "bzz-raw://9f660b1f351b757dfe01438e59888f31f33ded3afcf5cb5b0d9bf9aa6f320a8b",
            "dweb:/ipfs/QmarDJ5hZEgBtCmmrVzEZWjub9769eD686jmzb2XpSU1cM",
          ],
          license: "MIT",
        },
        "src/HyperwayMarketplace.sol": {
          keccak256:
            "0xbea0844b74f04bfec6ff554cf38a415f1b2410fc381c74cd8c0ff9c6479dc97b",
          urls: [
            "bzz-raw://816503649a89743efebaa82f63aa5557ea1c98d5fd23533d7d87f719440bf573",
            "dweb:/ipfs/QmX6k8tz8gDJMwdw8uQgNd3Mc7JXy77AqNqYmwJr2wMtbe",
          ],
          license: "MIT",
        },
        "src/interfaces/IXCM.sol": {
          keccak256:
            "0x1ac47de0dc7c2f6fb4139545283a3661561a46c4adc64853e7d00a79144066e0",
          urls: [
            "bzz-raw://ea92e866f7ba517ed049e72ac58b4def6cadfe482225172bae5eecb60723eac6",
            "dweb:/ipfs/QmYdJjyqju18i1oczY91WasGYQgEnwixDtJWQNbVhuqBG8",
          ],
          license: "MIT",
        },
      },
      version: 1,
    },
    id: 27,
  },
] as const;
