# GPU Compute Marketplace — Backend Architecture

**Your stack:** NestJS (TypeScript) · Supabase (PostgreSQL) · Python 

---

## Overview


| Service | Tech | Hosted On |
|---|---|---|
| NestJS App (Indexer + API) | NestJS + TypeScript + Viem | Railway |
| Database | Supabase (PostgreSQL + Realtime) | Supabase |
| IPFS utilities | Pinata SDK (used inside NestJS) | — |
| Provider Daemon | Python + Web3.py | Provider's machine |
| DB Schema & Migrations | SQL | Supabase |

---

## Project Structure

```
backend/
├── src/
│   ├── app.module.ts                  # Root module
│   │
│   ├── indexer/                       # Blockchain event listener
│   │   ├── indexer.module.ts
│   │   ├── indexer.service.ts         # Polling loop + event dispatch
│   │   ├── indexer.state.ts           # Tracks last indexed block
│   │   └── handlers/
│   │       ├── job-submitted.handler.ts
│   │       ├── job-assigned.handler.ts
│   │       ├── proof-submitted.handler.ts
│   │       ├── job-completed.handler.ts
│   │       └── provider-slashed.handler.ts
│   │
│   ├── jobs/                          # REST API: jobs
│   │   ├── jobs.module.ts
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   └── dto/
│   │       └── query-jobs.dto.ts
│   │
│   ├── providers/                     # REST API: providers
│   │   ├── providers.module.ts
│   │   ├── providers.controller.ts
│   │   └── providers.service.ts
│   │
│   ├── ipfs/                          # IPFS / Pinata wrapper
│   │   ├── ipfs.module.ts
│   │   └── ipfs.service.ts
│   │
│   ├── supabase/                      # Supabase client wrapper
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   │
│   ├── health/                        # Health check for Railway
│   │   └── health.controller.ts
│   │
│   └── config/
│       └── configuration.ts           # Env var schema (Joi validated)
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── provider-daemon/                   # Separate Python project
│   ├── daemon.py
│   ├── executor.py
│   ├── ipfs_client.py
│   ├── contract.py
│   └── requirements.txt
│
├── .env
├── nest-cli.json
└── package.json
```

---

## Service Responsibilities

### 1. Indexer Service (`src/indexer/`)

The heart of your backend. Runs as a **background NestJS service** using `@nestjs/schedule` for the polling loop.

**Flow:**
```
Every 10s:
  1. Read last_indexed_block from Supabase (indexer_state table)
  2. Fetch logs from Polkadot Hub RPC via Viem
  3. Decode each log → dispatch to the right handler
  4. Handler upserts data into Supabase
  5. Update last_indexed_block
```

**Key decisions:**
- Use Viem's `publicClient.getLogs()` — it handles ABI decoding cleanly
- Each event type gets its own handler class (single responsibility)
- Handlers are injected via NestJS DI — easy to test
- On error: log and continue (don't crash the service)

**Events you handle:**

| Event | Handler Action |
|---|---|
| `ProviderRegistered` | Insert into `providers` table |
| `JobSubmitted` | Insert into `jobs` table (status: PENDING) |
| `JobAssigned` | Update job status → ASSIGNED, set provider_address |
| `ProofSubmitted` | Update job with result_cid |
| `JobCompleted` | Update status → COMPLETED, update provider stats |
| `ProviderSlashed` | Insert into `job_events`, update provider stake |

---

### 2. REST API (`src/jobs/`, `src/providers/`)

Thin layer on top of Supabase. The frontend *could* query Supabase directly, but an API gives you control over filtering, pagination, and computed fields.

**Endpoints:**

```
GET  /jobs                    # List jobs (filter: status, buyer, provider)
GET  /jobs/:id                # Single job with events
GET  /providers               # List active providers
GET  /providers/:address      # Provider profile + stats
GET  /stats                   # Platform totals (jobs, volume, providers)
GET  /health                  # Railway health check
```

**What the frontend doesn't need from your API:**
- Real-time updates → handled by Supabase Realtime directly from frontend
- Write operations → frontend writes to smart contract, indexer picks it up

So your API is **read-only**. No auth needed for hackathon scope.

---

### 3. IPFS Service (`src/ipfs/`)

Wraps Pinata SDK. Injected wherever needed (currently only useful if you build an upload proxy endpoint — optional).

**Methods:**
```typescript
uploadFile(file: Buffer, filename: string): Promise<string>   // returns CID
uploadJSON(data: object): Promise<string>                      // returns CID
getGatewayUrl(cid: string): string                            // returns URL
```

**Note:** The frontend uploads directly to Pinata using its own API key. Your IPFS service is mainly used by the **provider daemon** (Python) for downloading job specs and uploading results. You can expose a `/upload` proxy endpoint if you want to hide the Pinata key, but it's optional for MVP.

---

### 4. Supabase Service (`src/supabase/`)

Single shared Supabase client instance, injected app-wide via NestJS DI. Uses the **service role key** (full DB access) since this is a trusted backend.

---

### 5. Provider Daemon (`provider-daemon/` — Python)

Runs on the **provider's own machine**, not Railway. Standalone Python script.

**Flow:**
```
On start:
  1. Load wallet from .env (private key)
  2. Connect to Polkadot Hub RPC

Polling loop (every 15s):
  1. Check for JobAssigned events where provider == my address
  2. If new job found:
     a. Download job spec from IPFS (using spec_cid)
     b. Execute compute locally (or mock: sleep 30s)
     c. Upload results to IPFS → get result_cid
     d. Call submitProof(jobId, resultCid, proof) on contract
  3. Log status
```

**Files:**
- `daemon.py` — main loop + CLI (`start`, `status`)
- `contract.py` — Web3.py wrapper for contract calls
- `ipfs_client.py` — Pinata upload/download helpers
- `executor.py` — actual compute logic (mock for MVP)

---

## Database Schema

```sql
-- Track indexer progress
CREATE TABLE indexer_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_block BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Providers
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  staked_amount BIGINT NOT NULL,
  gpu_specs JSONB,
  reputation_score INTEGER DEFAULT 50,
  total_jobs_completed INTEGER DEFAULT 0,
  total_jobs_failed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  registered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id BIGINT UNIQUE NOT NULL,        -- on-chain ID
  buyer_address TEXT NOT NULL,
  provider_address TEXT,
  spec_cid TEXT NOT NULL,
  result_cid TEXT,
  payment_amount BIGINT NOT NULL,
  compute_units BIGINT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  deadline TIMESTAMP,
  assigned_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit trail of all on-chain events
CREATE TABLE job_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id BIGINT NOT NULL,
  event_type TEXT NOT NULL,
  data JSONB,
  block_number BIGINT,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_buyer ON jobs(buyer_address);
CREATE INDEX idx_jobs_provider ON jobs(provider_address);
CREATE INDEX idx_providers_wallet ON providers(wallet_address);
CREATE INDEX idx_job_events_job_id ON job_events(job_id);
```

---

## Environment Variables

```bash
# Blockchain
CONTRACT_ADDRESS=0x...
RPC_URL=https://polkadot-hub-rpc.example.com
START_BLOCK=0
POLL_INTERVAL_MS=10000

# Supabase (service role — write access)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Pinata IPFS
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
PINATA_GATEWAY=https://gateway.pinata.cloud

# App
PORT=3001
NODE_ENV=production
```

---

## NestJS Module Dependency Graph

```
AppModule
├── ConfigModule (global)
├── ScheduleModule (global)
├── SupabaseModule (global)
├── IndexerModule
│   └── uses: SupabaseModule, ConfigModule
│       └── handlers inject SupabaseService
├── JobsModule
│   └── uses: SupabaseModule
├── ProvidersModule
│   └── uses: SupabaseModule
├── IpfsModule
│   └── uses: ConfigModule
└── HealthModule
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/schedule": "^4",
    "@nestjs/config": "^3",
    "@nestjs/terminus": "^10",
    "@supabase/supabase-js": "^2",
    "viem": "^2",
    "@pinata/sdk": "^2",
    "joi": "^17"
  }
}
```

---

## Railway Deployment

- One Railway service: the NestJS app
- Indexer runs **inside** the same NestJS process as a background `@Cron` job — no separate worker needed
- Health check: `GET /health` → Railway uses this to know the service is alive
- Set all env vars in Railway dashboard
- Auto-deploy on push to `main`

---

## What You Hand Off to the Frontend Dev

After Week 1, give them:

| Item | When |
|---|---|
| Supabase URL + anon key | Day 3 |
| Table names + column shapes | Day 3 |
| API base URL (Railway) | Week 2 |
| Contract ABI (copy from contracts/) | After they deploy |
| Pinata gateway URL | Day 3 |

---

## Week-by-Week Plan

### Week 1
- Day 1–2: Supabase schema, NestJS project scaffold, ConfigModule, SupabaseModule
- Day 3–4: Indexer polling loop + all event handlers (use mock ABI until contract is deployed)
- Day 5–7: REST API endpoints (jobs, providers, stats, health)

### Week 2
- Day 1–2: Swap mock ABI for real deployed contract, test indexer end-to-end
- Day 3–4: IPFS service + optional upload proxy endpoint
- Day 5–7: Python provider daemon (daemon.py, contract.py, ipfs_client.py)

### Week 3
- Day 1–2: Railway deployment, env setup, health monitoring
- Day 3–7: Bug fixes, support frontend integration, demo prep