# GPU Compute Marketplace - Polkadot Solidity Hackathon

**Track 2: PVM Smart Contracts - Accessing Polkadot Native Functionality**

A decentralized marketplace connecting AI developers who need GPU compute with providers who have spare capacity. Built on Polkadot Hub using XCM precompiles for cross-chain payments and native Polkadot features.

---

## 🎯 Problem Statement

**For AI Developers:**

- AWS/GCP GPU compute is expensive ($2-10/hour)
- Centralized platforms (Vast.ai, RunPod) can censor or restrict access
- No crypto-native payment options

**For GPU Providers:**

- Gaming rigs and workstations sit idle 18+ hours/day
- No easy way to monetize spare compute capacity
- Want passive income in cryptocurrency

**Our Solution:**
A trustless marketplace where providers stake DOT as collateral, buyers escrow stablecoin payments, and smart contracts handle job matching and proof verification. Cross-chain payments via XCM enable seamless transactions across the Polkadot ecosystem.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│               Frontend (Next.js 15)                      │
│  ├─ Buyer: Submit jobs, monitor status                  │
│  ├─ Provider: Register, claim jobs, submit proofs       │
│  └─ Real-time updates via Supabase subscriptions        │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               │ Web3 (Viem)         │ REST/WebSocket
               │                      │
┌──────────────▼──────────────┐  ┌──▼─────────────────────┐
│  Smart Contract             │  │   Supabase Backend      │
│  (Solidity on Polkadot Hub) │  │   ├─ PostgreSQL DB     │
│  ├─ Job escrow & matching   │  │   ├─ Real-time subs    │
│  ├─ Provider registry       │  │   └─ Indexed events    │
│  ├─ Proof verification      │  └────────────────────────┘
│  └─ XCM Precompile payments │           ▲
└──────────────┬──────────────┘           │
               │                          │
               │ Emit Events              │ Index Events
               │                          │
               └──────────────────────────┘
                    Node.js Indexer
                    (Deployed on Railway)

┌─────────────────────────────────────────────────────────┐
│              IPFS Storage (Pinata)                       │
│  ├─ Job specifications (datasets, requirements)         │
│  └─ Compute results (model weights, outputs)            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         Provider Daemon (Python - Optional)              │
│  ├─ Listens for JobAssigned events                      │
│  ├─ Downloads job spec from IPFS                        │
│  ├─ Executes compute locally                            │
│  ├─ Uploads results to IPFS                             │
│  └─ Submits proof to smart contract                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Smart Contracts

| Technology     | Version | Purpose                     |
| -------------- | ------- | --------------------------- |
| Solidity       | 0.8.20+ | Smart contract language     |
| Foundry        | Latest  | Compile, test, deploy       |
| XCM Precompile | -       | Cross-chain payment routing |
| OpenZeppelin   | 5.0+    | Secure contract libraries   |

### Frontend

| Technology     | Version | Purpose                         |
| -------------- | ------- | ------------------------------- |
| Next.js        | 15.x    | React framework with App Router |
| React          | 19.x    | UI library                      |
| TypeScript     | 5.x     | Type-safe development           |
| Wagmi          | 2.x     | React hooks for Ethereum        |
| Viem           | 2.x     | TypeScript Ethereum library     |
| TanStack Query | 5.x     | Data fetching & caching         |
| Tailwind CSS   | 4.x     | Utility-first styling           |
| Framer Motion  | 12.x    | Animations                      |
| shadcn/ui      | Latest  | Pre-built components            |

### Backend & Database

| Technology | Version | Purpose                              |
| ---------- | ------- | ------------------------------------ |
| Node.js    | 20.x    | Event indexer runtime                |
| Supabase   | Latest  | PostgreSQL + Real-time subscriptions |
| Prisma     | 6.x     | Database ORM (optional)              |
| Railway    | -       | Indexer hosting                      |

### Storage & Infrastructure

| Technology   | Purpose                                      |
| ------------ | -------------------------------------------- |
| Pinata       | IPFS pinning service for job specs & results |
| Polkadot Hub | EVM-compatible blockchain with XCM support   |
| Vercel       | Frontend hosting                             |

### Provider Daemon (Optional)

| Technology       | Purpose                    |
| ---------------- | -------------------------- |
| Python           | Compute execution script   |
| Web3.py          | Smart contract interaction |
| IPFS HTTP Client | File download/upload       |

---

## 📁 Project Structure

```
gpu-compute-marketplace/
├── contracts/                    # Foundry smart contracts
│   ├── src/
│   │   ├── ComputeMarketplace.sol   # Main marketplace contract
│   │   └── interfaces/
│   │       └── IXCM.sol             # XCM precompile interface
│   ├── test/
│   │   └── ComputeMarketplace.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
│
├── frontend/                     # Next.js application
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── marketplace/             # Browse available jobs
│   │   ├── submit-job/              # Buyer job submission
│   │   ├── provider-dashboard/      # Provider management
│   │   └── my-jobs/                 # User's job history
│   ├── components/
│   │   ├── JobCard.tsx
│   │   ├── ProviderCard.tsx
│   │   └── WalletConnect.tsx
│   ├── hooks/
│   │   ├── useJobs.ts               # Supabase real-time jobs
│   │   ├── useProviders.ts          # Provider data
│   │   └── useContract.ts           # Smart contract interactions
│   ├── lib/
│   │   ├── wagmi.ts                 # Web3 configuration
│   │   ├── supabase.ts              # Supabase client
│   │   └── contracts/
│   │       └── ComputeMarketplace.ts
│   └── package.json
│
├── indexer/                      # Event indexing service
│   ├── src/
│   │   ├── index.ts                 # Main indexer script
│   │   ├── eventHandlers.ts         # Process contract events
│   │   └── supabase.ts              # Database operations
│   ├── package.json
│   └── README.md
│
├── provider-daemon/              # Optional compute executor
│   ├── daemon.py                    # Main listener script
│   ├── executor.py                  # Job execution logic
│   ├── requirements.txt
│   └── README.md
│
└── supabase/
    ├── migrations/
    │   └── 001_initial_schema.sql   # Database schema
    └── seed.sql                     # Test data for development
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Foundry (for smart contracts)
- WSL2 (if on Windows)
- Supabase account
- Pinata account
- MetaMask or compatible wallet

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/gpu-compute-marketplace.git
cd gpu-compute-marketplace

# Install contract dependencies
cd contracts
forge install

# Install frontend dependencies
cd ../frontend
npm install

# Install indexer dependencies
cd ../indexer
npm install
```

### 2. Environment Setup

#### Frontend (.env.local)

```bash
# Blockchain
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=420420421
NEXT_PUBLIC_RPC_URL=https://polkadot-hub-rpc.example.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# IPFS
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

#### Indexer (.env)

```bash
# Blockchain
CONTRACT_ADDRESS=0x...
RPC_URL=https://polkadot-hub-rpc.example.com
START_BLOCK=0

# Supabase (use service key for write access)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Polling interval (milliseconds)
POLL_INTERVAL=10000
```

### 3. Database Setup

```bash
# Go to Supabase dashboard → SQL Editor
# Run the migration from supabase/migrations/001_initial_schema.sql

# Or use Supabase CLI
cd supabase
supabase db push
```

### 4. Smart Contract Deployment

```bash
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Deploy to Polkadot Hub testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify
```

### 5. Start Development

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Open http://localhost:3000

# Terminal 2: Indexer (optional for local dev)
cd indexer
npm run dev

# Terminal 3: Local blockchain (optional)
anvil
```

---

## 📊 Database Schema

### Core Tables

#### providers

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  staked_amount BIGINT NOT NULL,
  gpu_specs JSONB,  -- {vram: "24GB", model: "RTX 4090"}
  reputation_score INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### jobs

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id BIGINT UNIQUE NOT NULL,  -- On-chain job ID
  buyer_address TEXT NOT NULL,
  provider_address TEXT,
  spec_cid TEXT NOT NULL,  -- IPFS hash
  result_cid TEXT,
  payment_amount BIGINT NOT NULL,
  status TEXT NOT NULL,  -- PENDING, ASSIGNED, EXECUTING, COMPLETED, FAILED
  compute_requirements JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### job_events

```sql
CREATE TABLE job_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id BIGINT NOT NULL,
  event_type TEXT NOT NULL,
  data JSONB,
  block_number BIGINT,
  transaction_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 Smart Contract Interface

### Core Functions

```solidity
// Provider Management
function registerProvider(bytes memory gpuSpecs) external payable
function withdrawStake() external
function updateGPUSpecs(bytes memory gpuSpecs) external

// Job Management
function submitJob(
    bytes32 specCID,
    uint256 computeUnits,
    bytes memory requirements
) external payable returns (uint256 jobId)

function assignJob(uint256 jobId, address provider) external

// Proof Submission & Verification
function submitProof(
    uint256 jobId,
    bytes32 resultCID,
    bytes memory proof
) external

// XCM Cross-Chain Payments
function submitJobWithXCM(
    bytes32 specCID,
    uint256 computeUnits,
    bytes memory xcmMessage
) external

// Slashing & Disputes
function slashProvider(uint256 jobId, string memory reason) external
function disputeResult(uint256 jobId, string memory reason) external
```

### Events

```solidity
event ProviderRegistered(address indexed provider, uint256 stakedAmount);
event JobSubmitted(uint256 indexed jobId, address indexed buyer, uint256 payment);
event JobAssigned(uint256 indexed jobId, address indexed provider);
event ProofSubmitted(uint256 indexed jobId, bytes32 resultCID);
event JobCompleted(uint256 indexed jobId, address indexed provider, uint256 payment);
event ProviderSlashed(address indexed provider, uint256 amount, string reason);
```

---

## 🎨 Frontend Pages

### 1. Landing Page (`/`)

- Hero section with value proposition
- How it works (3-step flow)
- Statistics (total jobs, providers, volume)
- CTA buttons (Submit Job, Become Provider)

### 2. Marketplace (`/marketplace`)

- List of available jobs (PENDING status)
- Filters (price range, compute requirements, deadline)
- Real-time updates when new jobs arrive
- Provider can claim jobs

### 3. Submit Job (`/submit-job`)

- Upload job specification file
- Set compute requirements (GPU VRAM, duration)
- Set payment amount
- Upload to IPFS → Submit to contract

### 4. Provider Dashboard (`/provider-dashboard`)

- Registration form (stake DOT, set GPU specs)
- Active jobs list
- Earnings summary
- Reputation score

### 5. My Jobs (`/my-jobs`)

- Buyer: Track submitted jobs, view results
- Provider: Track claimed jobs, submit proofs

---

## 🔄 Event Indexer Flow

```typescript
// High-level indexer logic
async function indexEvents() {
  while (true) {
    // 1. Get last indexed block from Supabase
    const lastBlock = await getLastBlock();

    // 2. Fetch new contract events
    const events = await fetchEvents(lastBlock + 1, "latest");

    // 3. Process each event
    for (const event of events) {
      switch (event.name) {
        case "JobSubmitted":
          await insertJob(event.args);
          break;
        case "JobAssigned":
          await updateJobStatus(event.args.jobId, "ASSIGNED");
          break;
        case "ProofSubmitted":
          await updateJobStatus(event.args.jobId, "COMPLETED");
          break;
        // ... handle other events
      }
    }

    // 4. Update last indexed block
    await updateLastBlock(latestBlock);

    // 5. Wait before next poll
    await sleep(10000); // 10 seconds
  }
}
```

---

## 🎯 Track 2 Compliance

This project qualifies for **Track 2: PVM Smart Contracts** under the category:
**"Accessing Polkadot native functionality - build with precompiles"**

### How We Use Polkadot-Native Features:

1. **XCM Precompile Integration**
   - Accept payments from Asset Hub (stablecoins)
   - Cross-chain payment routing via XCM messaging
   - Demonstrates true Polkadot interoperability

2. **Polkadot Hub Benefits**
   - Shared security from relay chain
   - Native DOT staking for collateral
   - Seamless parachain communication

3. **Production-Ready Architecture**
   - Real-time event indexing
   - Scalable database design
   - Professional frontend UX

---

## 🗓️ Development Timeline & Implementation Plan

### Team Structure

**Your Role (Frontend + Smart Contracts):**

- Smart contract development and testing
- Frontend pages and components
- Web3 integration (Wagmi + Viem)
- Demo preparation and presentation

**Backend Developer Role:**

- Event indexer implementation
- Supabase setup and configuration
- IPFS utilities and integration
- Provider daemon (Python)
- Railway deployment

---

### Week 1: Core Infrastructure (March 1-7)

#### Your Tasks (25 hours)

**Day 1-2: Smart Contract Foundation**

- [x] Review architecture and design decisions
- [x] Set up Foundry project structure
- [x] Write core data structures (Provider, Job, JobStatus)
- [x] Implement provider registration with DOT staking
- [x] Write basic tests
- **Deliverable:** `ComputeMarketplace.sol` with provider registry

**Day 3-4: Job Management Functions**

- [x] Implement job submission with payment escrow
- [x] Add job assignment logic
- [x] Create proof submission function
- [x] Add slashing mechanism for failed jobs
- [x] Write comprehensive tests
- **Deliverable:** Complete job lifecycle in smart contract

**Day 5: Frontend Setup**

- [x] Create Next.js 15 project with TypeScript
- [ ] Install and configure Wagmi + Viem
- [ ] Set up Polkadot Hub chain configuration
- [ ] Create wallet connection component
- [ ] Set up Tailwind CSS and project structure
- **Deliverable:** Working wallet connection page

**Day 6-7: Deploy & Integrate**

- [ ] Deploy contract to Polkadot Hub testnet
- [ ] Verify contract on block explorer
- [ ] Create contract interaction hooks
- [ ] Test end-to-end wallet → contract flow
- **Deliverable:** Deployed contract + frontend can call it

#### Backend Dev Tasks (15 hours)

**Day 1-2: Supabase Setup**

- [ ] Create Supabase project
- [ ] Run database schema migration
- [ ] Set up Row Level Security policies
- [ ] Configure real-time subscriptions
- [ ] Create test data seed script
- **Deliverable:** Live database with all tables

**Day 3-4: IPFS Utilities**

- [ ] Create Pinata account and get API keys
- [ ] Build `uploadToIPFS()` function for files
- [ ] Build `uploadJSON()` for metadata
- [ ] Build `downloadFromIPFS()` function
- [ ] Add error handling and retry logic
- [ ] Write unit tests
- **Deliverable:** Reusable IPFS library (`lib/ipfs.ts`)

**Day 5-7: Event Indexer Foundation**

- [ ] Set up Node.js + TypeScript project
- [ ] Install dependencies (viem, @supabase/supabase-js)
- [ ] Create basic polling loop structure
- [ ] Test connection to Polkadot Hub RPC
- [ ] Test connection to Supabase
- **Deliverable:** Indexer skeleton that can fetch latest block

**Checkpoint:** End of Week 1

- ✅ Smart contract deployed and tested
- ✅ Frontend can connect wallets
- ✅ Supabase database live
- ✅ IPFS utilities ready
- ✅ Indexer foundation started

---

### Week 2: Integration & Features (March 8-14)

#### Your Tasks (30 hours)

**Day 1-2: XCM Precompile Integration**

- [ ] Research XCM precompile documentation
- [ ] Find and import XCM.sol interface
- [ ] Add `submitJobWithXCM()` function to contract
- [ ] Test cross-chain payment acceptance
- [ ] Update contract tests for XCM
- **Deliverable:** Contract accepts payments via XCM

**Day 3-4: Job Submission Page**

- [ ] Create `/submit-job` page
- [ ] Build file upload component
- [ ] Integrate IPFS upload (use backend dev's library)
- [ ] Create job submission form (requirements, payment)
- [ ] Connect to smart contract `submitJob()`
- [ ] Add transaction status feedback
- **Deliverable:** Working job submission flow

**Day 5-6: Marketplace Page**

- [ ] Create `/marketplace` page
- [ ] Fetch jobs from Supabase (real-time)
- [ ] Display job cards with details
- [ ] Add filters (price, compute requirements)
- [ ] Implement job claiming for providers
- [ ] Show real-time updates when new jobs appear
- **Deliverable:** Live marketplace with real-time updates

**Day 7: Provider Dashboard**

- [ ] Create `/provider-dashboard` page
- [ ] Build registration form (stake DOT, GPU specs)
- [ ] Show active/completed jobs
- [ ] Display earnings and reputation
- [ ] Add proof submission interface
- **Deliverable:** Provider can register and manage jobs

#### Backend Dev Tasks (25 hours)

**Day 1-3: Event Indexer Implementation**

- [ ] Implement event fetching from contract
- [ ] Create event handlers for each event type:
  - `ProviderRegistered` → Insert into providers table
  - `JobSubmitted` → Insert into jobs table
  - `JobAssigned` → Update job status
  - `ProofSubmitted` → Update job with result
  - `JobCompleted` → Update provider stats
  - `ProviderSlashed` → Record in job_events
- [ ] Add error handling and retry logic
- [ ] Implement state persistence (last indexed block)
- [ ] Add logging for monitoring
- **Deliverable:** Fully functional event indexer

**Day 4-5: Railway Deployment**

- [ ] Create Railway account
- [ ] Set up GitHub repository for indexer
- [ ] Configure environment variables in Railway
- [ ] Add health check endpoint
- [ ] Deploy and test in production
- [ ] Set up logging and monitoring
- **Deliverable:** Indexer running 24/7 on Railway

**Day 6-7: Provider Daemon (Python)**

- [ ] Create Python project structure
- [ ] Implement wallet connection (Web3.py)
- [ ] Add contract event listening
- [ ] Build IPFS download/upload functions
- [ ] Create mock job execution (sleep 10s)
- [ ] Implement proof submission
- [ ] Add CLI commands (start, status, claim)
- [ ] Write installation guide
- **Deliverable:** Working provider daemon script

**Checkpoint:** End of Week 2

- ✅ XCM payments working
- ✅ Job submission page complete
- ✅ Marketplace with real-time updates
- ✅ Provider dashboard functional
- ✅ Event indexer deployed and running
- ✅ Provider daemon ready to use

---

### Week 3: Polish & Demo (March 15-20)

#### Your Tasks (20 hours)

**Day 1-2: UI/UX Polish**

- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add success/error notifications (toast)
- [ ] Improve mobile responsiveness
- [ ] Add animations with Framer Motion
- [ ] Create landing page with hero section
- **Deliverable:** Professional-looking UI

**Day 3: My Jobs Page**

- [ ] Create `/my-jobs` page
- [ ] Show user's submitted jobs (buyer view)
- [ ] Show user's claimed jobs (provider view)
- [ ] Add job status tracking
- [ ] Display results and download links
- **Deliverable:** Complete job tracking page

**Day 4: Testing & Bug Fixes**

- [ ] End-to-end testing of all flows
- [ ] Test with multiple wallets
- [ ] Fix any bugs discovered
- [ ] Test on mobile devices
- [ ] Verify real-time updates work
- **Deliverable:** Bug-free application

**Day 5: Demo Preparation**

- [ ] Write demo script
- [ ] Prepare test data (jobs, providers)
- [ ] Record demo video (5 minutes)
- [ ] Create pitch deck (optional)
- [ ] Screenshot all features
- **Deliverable:** Demo video ready

**Day 6-7: Documentation & Submission**

- [ ] Update README with deployment URLs
- [ ] Add architecture diagrams
- [ ] Write setup instructions
- [ ] Document API/contract interfaces
- [ ] Submit to hackathon platform
- **Deliverable:** Complete submission package

#### Backend Dev Tasks (10 hours)

**Day 1-2: Provider Daemon Polish**

- [ ] Add better error messages
- [ ] Improve installation docs
- [ ] Test on Windows/Mac/Linux
- [ ] Add example job specs
- [ ] Create demo video of daemon
- **Deliverable:** Production-ready daemon

**Day 3-4: Monitoring & Optimization**

- [ ] Add Supabase query optimization
- [ ] Set up indexer health monitoring
- [ ] Add database indexes if needed
- [ ] Test indexer under load
- [ ] Document troubleshooting steps
- **Deliverable:** Optimized backend

**Day 5-7: Support & Backup**

- [ ] Be available for bug fixes
- [ ] Help with demo preparation
- [ ] Assist with testing
- [ ] Write technical documentation
- **Deliverable:** Support during final push

**Final Checkpoint:** March 20

- ✅ All features complete and tested
- ✅ Demo video recorded
- ✅ Documentation finalized
- ✅ Submission ready
- ✅ Live deployment working

---

## 📋 Detailed Technical Specifications

### Smart Contract Implementation

#### Core State Variables

```solidity
// Provider management
mapping(address => Provider) public providers;
mapping(address => bool) public isProvider;
uint256 public minStakeAmount = 1 ether; // Minimum DOT stake

// Job management
mapping(uint256 => Job) public jobs;
uint256 public nextJobId = 1;
mapping(address => uint256[]) public providerJobs;
mapping(address => uint256[]) public buyerJobs;

// Contract configuration
address public owner;
uint256 public platformFee = 250; // 2.5% in basis points
address public feeRecipient;
```

#### Provider Struct

```solidity
struct Provider {
    address providerAddress;
    uint256 stakedAmount;
    bytes gpuSpecs;           // JSON: {vram: "24GB", model: "RTX 4090"}
    uint8 reputationScore;    // 0-100
    uint256 totalJobsCompleted;
    uint256 totalJobsFailed;
    bool isActive;
    uint256 registeredAt;
}
```

#### Job Struct

```solidity
struct Job {
    uint256 jobId;
    address buyer;
    address provider;
    bytes32 specCID;          // IPFS hash of job specification
    bytes32 resultCID;        // IPFS hash of results
    uint256 paymentAmount;
    uint256 computeUnits;     // Estimated compute time in seconds
    JobStatus status;
    uint256 createdAt;
    uint256 assignedAt;
    uint256 completedAt;
    uint256 deadline;
}

enum JobStatus {
    PENDING,
    ASSIGNED,
    EXECUTING,
    COMPLETED,
    FAILED,
    DISPUTED
}
```

#### Critical Functions to Implement

```solidity
// 1. Provider Registration
function registerProvider(bytes memory gpuSpecs) external payable {
    require(msg.value >= minStakeAmount, "Insufficient stake");
    require(!isProvider[msg.sender], "Already registered");

    providers[msg.sender] = Provider({
        providerAddress: msg.sender,
        stakedAmount: msg.value,
        gpuSpecs: gpuSpecs,
        reputationScore: 50, // Start at neutral
        totalJobsCompleted: 0,
        totalJobsFailed: 0,
        isActive: true,
        registeredAt: block.timestamp
    });

    isProvider[msg.sender] = true;
    emit ProviderRegistered(msg.sender, msg.value);
}

// 2. Job Submission
function submitJob(
    bytes32 specCID,
    uint256 computeUnits,
    bytes memory requirements
) external payable returns (uint256) {
    require(msg.value > 0, "Payment required");

    uint256 jobId = nextJobId++;

    jobs[jobId] = Job({
        jobId: jobId,
        buyer: msg.sender,
        provider: address(0),
        specCID: specCID,
        resultCID: bytes32(0),
        paymentAmount: msg.value,
        computeUnits: computeUnits,
        status: JobStatus.PENDING,
        createdAt: block.timestamp,
        assignedAt: 0,
        completedAt: 0,
        deadline: block.timestamp + (computeUnits * 2) // 2x compute time
    });

    buyerJobs[msg.sender].push(jobId);

    emit JobSubmitted(jobId, msg.sender, specCID, msg.value);
    return jobId;
}

// 3. Job Assignment (Manual claiming for MVP)
function assignJob(uint256 jobId) external {
    require(isProvider[msg.sender], "Not a provider");
    require(providers[msg.sender].isActive, "Provider not active");

    Job storage job = jobs[jobId];
    require(job.status == JobStatus.PENDING, "Job not available");

    job.provider = msg.sender;
    job.status = JobStatus.ASSIGNED;
    job.assignedAt = block.timestamp;

    providerJobs[msg.sender].push(jobId);

    emit JobAssigned(jobId, msg.sender);
}

// 4. Proof Submission
function submitProof(
    uint256 jobId,
    bytes32 resultCID,
    bytes memory proof
) external {
    Job storage job = jobs[jobId];
    require(msg.sender == job.provider, "Not assigned provider");
    require(job.status == JobStatus.ASSIGNED, "Invalid job status");

    // Simple proof verification (challenge-response)
    // For MVP: buyer includes expected hash in job spec
    // Provider must provide matching result

    job.resultCID = resultCID;
    job.status = JobStatus.COMPLETED;
    job.completedAt = block.timestamp;

    // Release payment
    uint256 fee = (job.paymentAmount * platformFee) / 10000;
    uint256 providerPayment = job.paymentAmount - fee;

    payable(job.provider).transfer(providerPayment);
    payable(feeRecipient).transfer(fee);

    // Update provider stats
    providers[msg.sender].totalJobsCompleted++;
    _updateReputation(msg.sender, true);

    emit ProofSubmitted(jobId, resultCID);
    emit JobCompleted(jobId, msg.sender, providerPayment);
}

// 5. XCM Payment Integration (Track 2 requirement)
function submitJobWithXCM(
    bytes32 specCID,
    uint256 computeUnits,
    bytes memory xcmMessage
) external returns (uint256) {
    // Import XCM precompile interface
    // IXCM xcm = IXCM(XCM_PRECOMPILE_ADDRESS);

    // Execute XCM to transfer tokens from source parachain
    // xcm.execute(xcmMessage);

    // Create job with transferred funds
    // For MVP: Can start with native payments and add XCM Week 2

    return submitJob(specCID, computeUnits, "");
}

// 6. Slashing for Failed Jobs
function slashProvider(uint256 jobId) external {
    Job storage job = jobs[jobId];
    require(msg.sender == job.buyer, "Only buyer can slash");
    require(block.timestamp > job.deadline, "Job not timed out");
    require(job.status == JobStatus.ASSIGNED, "Invalid status");

    job.status = JobStatus.FAILED;

    Provider storage provider = providers[job.provider];
    uint256 slashAmount = provider.stakedAmount / 10; // 10% slash

    // Refund buyer
    payable(job.buyer).transfer(job.paymentAmount);

    // Slash provider stake
    provider.stakedAmount -= slashAmount;
    payable(feeRecipient).transfer(slashAmount);

    provider.totalJobsFailed++;
    _updateReputation(job.provider, false);

    emit ProviderSlashed(job.provider, slashAmount, "Job timeout");
}

// Helper: Update reputation
function _updateReputation(address provider, bool success) internal {
    Provider storage p = providers[provider];
    uint256 total = p.totalJobsCompleted + p.totalJobsFailed;

    if (total > 0) {
        p.reputationScore = uint8((p.totalJobsCompleted * 100) / total);
    }
}
```

---

### Frontend Implementation Guide

#### Wagmi Configuration

```typescript
// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { defineChain } from "viem";

export const polkadotHub = defineChain({
  id: 420420421,
  name: "Polkadot Hub",
  network: "polkadot-hub",
  nativeCurrency: {
    decimals: 18,
    name: "DOT",
    symbol: "DOT",
  },
  rpcUrls: {
    default: {
      http: ["https://polkadot-hub-rpc.example.com"],
    },
    public: {
      http: ["https://polkadot-hub-rpc.example.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://polkadot-hub.blockscout.com",
    },
  },
});

export const config = createConfig({
  chains: [polkadotHub],
  transports: {
    [polkadotHub.id]: http(),
  },
});
```

#### Contract Interaction Hook

```typescript
// hooks/useMarketplace.ts
import { useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/lib/contracts";

export function useSubmitJob() {
  const { writeContractAsync } = useWriteContract();

  const submitJob = async (
    specCID: string,
    computeUnits: number,
    payment: string,
  ) => {
    const hash = await writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "submitJob",
      args: [specCID, BigInt(computeUnits), "0x"],
      value: parseEther(payment),
    });

    return hash;
  };

  return { submitJob };
}

export function useRegisterProvider() {
  const { writeContractAsync } = useWriteContract();

  const register = async (gpuSpecs: object, stakeAmount: string) => {
    const hash = await writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "registerProvider",
      args: [JSON.stringify(gpuSpecs)],
      value: parseEther(stakeAmount),
    });

    return hash;
  };

  return { register };
}
```

#### Supabase Real-Time Hook

```typescript
// hooks/useJobs.ts
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useJobs(status?: string) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchJobs = async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data } = await query;
      setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("jobs-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: status ? `status=eq.${status}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setJobs((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setJobs((prev) =>
              prev.map((job) =>
                job.job_id === payload.new.job_id ? payload.new : job,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status]);

  return { jobs, loading };
}
```

---

### Event Indexer Implementation

#### Main Indexer Loop

```typescript
// indexer/src/index.ts
import { createPublicClient, http, parseAbiItem } from "viem";
import { createClient } from "@supabase/supabase-js";
import { polkadotHub } from "./chains";

const publicClient = createPublicClient({
  chain: polkadotHub,
  transport: http(process.env.RPC_URL),
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

async function getLastIndexedBlock(): Promise<bigint> {
  const { data } = await supabase
    .from("indexer_state")
    .select("last_block")
    .single();

  return BigInt(data?.last_block || 0);
}

async function updateLastIndexedBlock(block: bigint) {
  await supabase
    .from("indexer_state")
    .upsert({ id: 1, last_block: block.toString() });
}

async function indexEvents() {
  console.log("🚀 Starting event indexer...");

  while (true) {
    try {
      const fromBlock = await getLastIndexedBlock();
      const toBlock = await publicClient.getBlockNumber();

      if (fromBlock >= toBlock) {
        console.log("✅ Up to date, waiting...");
        await sleep(10000);
        continue;
      }

      console.log(`📊 Indexing blocks ${fromBlock} to ${toBlock}`);

      // Fetch all events
      const logs = await publicClient.getLogs({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        fromBlock: fromBlock + 1n,
        toBlock: toBlock,
      });

      // Process each event
      for (const log of logs) {
        await processEvent(log);
      }

      // Update state
      await updateLastIndexedBlock(toBlock);
    } catch (error) {
      console.error("❌ Indexer error:", error);
      await sleep(5000); // Wait before retry
    }
  }
}

async function processEvent(log: any) {
  // Decode event based on topics
  const eventSignature = log.topics[0];

  // JobSubmitted event
  if (
    eventSignature ===
    parseAbiItem(
      "event JobSubmitted(uint256 indexed jobId, address indexed buyer, bytes32 specCID, uint256 payment)",
    ).signature
  ) {
    const [jobId, buyer] = log.topics.slice(1);
    // Decode data for specCID and payment

    await supabase.from("jobs").insert({
      job_id: Number(jobId),
      buyer_address: buyer,
      spec_cid: specCID,
      payment_amount: payment.toString(),
      status: "PENDING",
    });

    console.log(`✅ Indexed JobSubmitted: ${jobId}`);
  }

  // JobAssigned event
  // ... similar pattern for other events
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start indexer
indexEvents();
```

---

## 🎯 Success Criteria

### Minimum Viable Product (Must Have)

- [ ] Smart contract deployed and verified
- [ ] Providers can register and stake DOT
- [ ] Buyers can submit jobs with payment
- [ ] Jobs appear in marketplace in real-time
- [ ] Providers can claim jobs
- [ ] Proof submission releases payment
- [ ] XCM precompile integration (Track 2 requirement)
- [ ] Working demo video
- [ ] Clean, professional UI

### Nice to Have (Bonus Points)

- [ ] Provider daemon actually works
- [ ] Reputation system visible in UI
- [ ] Job filtering and search
- [ ] Mobile responsive design
- [ ] Analytics dashboard
- [ ] Dispute mechanism

### Demo Must Show

1. ✅ Provider registration with DOT staking
2. ✅ Job submission with IPFS upload
3. ✅ Real-time marketplace updates
4. ✅ Provider claiming job
5. ✅ Proof submission and payment release
6. ✅ XCM cross-chain payment (even if mocked)

---

## 📞 Daily Standup Template

**What did you accomplish yesterday?**

- [List completed tasks]

**What will you work on today?**

- [List today's tasks]

**Any blockers or questions?**

- [List any issues]

**Next sync:** [Time/Date]

---

## 🧪 Testing Strategy

### Smart Contract Tests

```bash
cd contracts
forge test -vvv

# Specific test
forge test --match-test testJobSubmission

# Coverage
forge coverage
```

### Frontend Tests

```bash
cd frontend
npm run test

# E2E tests (optional)
npm run test:e2e
```

---

## 🚀 Deployment

### Smart Contracts

```bash
# Deploy to Polkadot Hub testnet
forge script script/Deploy.s.sol \
  --rpc-url $POLKADOT_HUB_RPC \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Frontend (Vercel)

```bash
cd frontend
vercel deploy --prod
```

### Indexer (Railway)

```bash
cd indexer
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Auto-deploy on push
```

---

## 🎥 Demo Script

### Opening (30 seconds)

"Meet GPU Compute Marketplace - the decentralized Airbnb for GPU compute. AI developers get affordable compute, providers monetize idle hardware, all powered by Polkadot's cross-chain infrastructure."

### User Flow 1: Submit Job (1 minute)

1. Connect wallet
2. Upload job specification to IPFS
3. Set payment in stablecoin (via XCM from Asset Hub)
4. Submit to smart contract
5. Real-time marketplace updates

### User Flow 2: Provider Claims Job (1 minute)

1. Provider registers, stakes DOT
2. Browse available jobs
3. Claim job → collateral locked
4. Execute compute → upload results
5. Submit proof → payment released

### Technical Highlights (30 seconds)

- XCM precompile for cross-chain payments
- Real-time updates via Supabase
- Decentralized storage with IPFS
- Trustless escrow and slashing

---

## 🏆 Competitive Advantages

1. **Polkadot-Native**: First compute marketplace using XCM for payments
2. **Real-Time UX**: Instant updates via Supabase subscriptions
3. **Production-Ready**: Complete indexer, database, and frontend
4. **Trustless**: Smart contract escrow, collateral staking, proof verification
5. **Ecosystem Play**: Integrates with Asset Hub, uses DOT for collateral

---

## 📚 Resources

### Documentation

- [Polkadot Hub Docs](https://docs.polkadot.com/smart-contracts/)
- [XCM Precompiles](https://docs.polkadot.com/smart-contracts/precompiles/xcm/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Docs](https://wagmi.sh/)

### Community

- [Polkadot Discord](https://discord.gg/polkadot)
- [OpenGuild Discord](https://discord.gg/WWgzkDfPQF)
- [Telegram Support](https://t.me/substratedevs)

---

## 🤝 Contributing

This is a hackathon project, but contributions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this code for your own projects

---

## 👥 Team

Built by [Your Name] for the Polkadot Solidity Hackathon (Track 2)

**Previous Work**: Devra - Decentralized Data Marketplace (Winner at previous Polkadot hackathon)

---

## 🙏 Acknowledgments

- OpenGuild for organizing the hackathon
- Web3 Foundation for Polkadot ecosystem support
- Polkadot Hub team for documentation and tooling
- The broader Polkadot community

---

**Demo**: [Coming Soon]  
**Deployed Contract**: [Coming Soon]  
**Live App**: [Coming Soon]

Built with ❤️ on Polkadot Hub
