# Hyperway Backend

Event indexer + REST API for the Hyperway GPU compute marketplace on Polkadot Hub testnet.

## Stack

- **NestJS** — event indexer + REST API (single Railway deployment)
- **Supabase** — PostgreSQL database + Realtime for frontend subscriptions
- **Viem** — Ethereum RPC client for log fetching and ABI decoding
- **Polkadot Hub Testnet** — Chain ID `420420417`

## Architecture

The app runs two things in the same process:

1. **Indexer** — a cron job that polls the `HyperwayMarketplace` contract every 10 seconds, fetches logs in 500-block chunks, decodes events via ABI, and writes state to Supabase
2. **REST API** — read-only HTTP endpoints that serve indexed data to the frontend

## Contract

| | |
|---|---|
| Address | `0x25e485fc5492ce1c65cfd438de6d64eb62335cd7` |
| Network | Polkadot Hub Testnet |
| RPC | `https://eth-rpc-testnet.polkadot.io/` |
| Deployed at block | `5,992,967` |

## Indexed Events

| Event | Action |
|---|---|
| `ProviderRegistered` | Insert provider |
| `JobSubmitted` | Insert job (PENDING) |
| `XCMJobSubmitted` | Insert job via XCM (PENDING) |
| `JobAssigned` | Update job → ASSIGNED |
| `ProofSubmitted` | Update job result_cid |
| `JobCompleted` | Update job → COMPLETED, increment provider stats |
| `JobFailed` | Update job → FAILED, increment provider stats |
| `JobDisputed` | Update job → DISPUTED, write audit event |
| `DisputeResolved` | Update job → COMPLETED or FAILED |
| `ProviderSlashed` | Decrement provider stake, write audit event |
| `StakeWithdrawn` | Zero out provider stake |
| `ProviderDeactivated` | Set provider is_active = false |
| `ProviderReactivated` | Set provider is_active = true |
| `GPUSpecsUpdated` | Update provider gpu_specs |

## REST API

All endpoints are read-only, no authentication required.

```
GET /health                          # Health check for Railway
GET /stats                           # Platform totals and volume
GET /jobs                            # List jobs (filter: status, buyer, provider, limit, offset)
GET /jobs/:id                        # Single job + audit events (accepts on-chain id or UUID)
GET /providers                       # List active providers ordered by reputation
GET /providers/:address              # Provider profile + 10 recent jobs
```

## Database

Four tables in Supabase:

- `indexer_state` — tracks last indexed block (single row)
- `providers` — registered GPU providers
- `jobs` — compute jobs with status lifecycle
- `job_events` — audit log for significant state changes (assigned, completed, disputed, slashed)

Supabase Realtime is enabled on `jobs` and `providers` so the frontend can subscribe directly without polling the API.

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**
```bash
CONTRACT_ADDRESS=0x25e485fc5492ce1c65cfd438de6d64eb62335cd7
RPC_URL=https://eth-rpc-testnet.polkadot.io/
START_BLOCK=5992967
POLL_INTERVAL_MS=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=3001
NODE_ENV=development
```

**3. Run Supabase migration**

Paste `supabase/migrations/001_initial_schema.sql` into the Supabase SQL editor and run it.

**4. Start**
```bash
npm run start:dev     # development
npm run start:prod    # production
```

## Deployment

Deploys to Railway as a single service. Set all environment variables in Railway dashboard. Railway uses `GET /health` to verify the service is alive.