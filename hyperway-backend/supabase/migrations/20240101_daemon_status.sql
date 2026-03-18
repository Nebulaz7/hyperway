-- Migration: daemon_status table
-- Stores periodic heartbeats and per-job lifecycle events written by the
-- hyperway-service provider daemon so the frontend dashboard can display
-- live provider activity.

CREATE TABLE IF NOT EXISTS daemon_status (
    id               BIGSERIAL PRIMARY KEY,
    provider_address TEXT        NOT NULL,
    event_type       TEXT        NOT NULL,  -- 'heartbeat' | 'job_init' | 'job_in_progress' | 'job_proof_tx' | 'job_completed' | 'job_failed'
    job_id           INTEGER,               -- NULL for heartbeat events
    message          TEXT        NOT NULL DEFAULT '',
    extra            JSONB       NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Efficiently retrieve the latest events for a given provider
CREATE INDEX IF NOT EXISTS idx_daemon_status_provider_time
    ON daemon_status (provider_address, created_at DESC);

-- Enable Supabase Realtime on this table so the frontend can subscribe
ALTER TABLE daemon_status REPLICA IDENTITY FULL;

-- Allow anon/service-role reads (frontend uses the anon key)
ALTER TABLE daemon_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read daemon_status"
    ON daemon_status FOR SELECT
    USING (true);

-- Only the service role (used by the daemon) may insert
CREATE POLICY "service insert daemon_status"
    ON daemon_status FOR INSERT
    WITH CHECK (true);
