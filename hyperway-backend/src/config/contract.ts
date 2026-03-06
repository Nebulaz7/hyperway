export const CONTRACT_ABI = [
  {
    type: 'event',
    name: 'ProviderRegistered',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'provider', type: 'address' },
      { indexed: false, name: 'stakedAmount', type: 'uint256' },
      { indexed: false, name: 'gpuSpecs', type: 'bytes' },
    ],
  },
  {
    type: 'event',
    name: 'JobSubmitted',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'specCID', type: 'bytes32' },
      { indexed: false, name: 'payment', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'XCMJobSubmitted',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'specCID', type: 'bytes32' },
    ],
  },
  {
    type: 'event',
    name: 'JobAssigned',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'provider', type: 'address' },
    ],
  },
  {
    type: 'event',
    name: 'ProofSubmitted',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: false, name: 'resultCID', type: 'bytes32' },
    ],
  },
  {
    type: 'event',
    name: 'JobCompleted',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'provider', type: 'address' },
      { indexed: false, name: 'providerPayment', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'JobFailed',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'provider', type: 'address' },
    ],
  },
  {
    type: 'event',
    name: 'JobDisputed',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'reason', type: 'string' },
    ],
  },
  {
    type: 'event',
    name: 'DisputeResolved',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'jobId', type: 'uint256' },
      { indexed: false, name: 'buyerWins', type: 'bool' },
    ],
  },
  {
    type: 'event',
    name: 'ProviderSlashed',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'provider', type: 'address' },
      { indexed: false, name: 'slashAmount', type: 'uint256' },
      { indexed: false, name: 'reason', type: 'string' },
    ],
  },
  {
    type: 'event',
    name: 'StakeWithdrawn',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'provider', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'ProviderDeactivated',
    anonymous: false,
    inputs: [{ indexed: true, name: 'provider', type: 'address' }],
  },
  {
    type: 'event',
    name: 'ProviderReactivated',
    anonymous: false,
    inputs: [{ indexed: true, name: 'provider', type: 'address' }],
  },
  {
    type: 'event',
    name: 'GPUSpecsUpdated',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'provider', type: 'address' },
      { indexed: false, name: 'newSpecs', type: 'bytes' },
    ],
  },
] as const;

export const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS as `0x${string}`;