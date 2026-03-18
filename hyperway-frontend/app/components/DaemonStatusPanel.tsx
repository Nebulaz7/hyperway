"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

type DaemonEvent = {
  id: number;
  provider_address: string;
  event_type:
    | "heartbeat"
    | "job_init"
    | "job_in_progress"
    | "job_proof_tx"
    | "job_completed"
    | "job_failed";
  job_id: number | null;
  message: string;
  extra: Record<string, unknown>;
  created_at: string;
};

// Daemon is offline if the last heartbeat is older than 90 seconds
const OFFLINE_THRESHOLD_MS = 90_000;

// Maximum activity log entries shown in the panel
const MAX_LOG_ENTRIES = 20;

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

const EVENT_CONFIG: Record<
  DaemonEvent["event_type"],
  { icon: string; color: string; label: string }
> = {
  heartbeat: { icon: "💓", color: "text-gray-500", label: "Heartbeat" },
  job_init: { icon: "📥", color: "text-blue-400", label: "Job Received" },
  job_in_progress: {
    icon: "⚙️",
    color: "text-yellow-400",
    label: "Processing",
  },
  job_proof_tx: { icon: "📤", color: "text-purple-400", label: "Proof Sent" },
  job_completed: { icon: "✅", color: "text-green-400", label: "Completed" },
  job_failed: { icon: "❌", color: "text-red-400", label: "Failed" },
};

// ── Component ──────────────────────────────────────────────────────────────

interface DaemonStatusPanelProps {
  providerAddress: string;
}

export default function DaemonStatusPanel({
  providerAddress,
}: DaemonStatusPanelProps) {
  const [events, setEvents] = useState<DaemonEvent[]>([]);
  const [isOnline, setIsOnline] = useState<boolean | null>(null); // null = loading
  const [lastHeartbeat, setLastHeartbeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Derive online status from events ──

  const updateOnlineStatus = useCallback((evts: DaemonEvent[]) => {
    const hb = evts.find((e) => e.event_type === "heartbeat");
    if (!hb) {
      setIsOnline(false);
      setLastHeartbeat(null);
      return;
    }
    const age = Date.now() - new Date(hb.created_at).getTime();
    setIsOnline(age < OFFLINE_THRESHOLD_MS);
    setLastHeartbeat(hb.created_at);
  }, []);

  // ── Initial fetch ──

  useEffect(() => {
    if (!providerAddress) return;

    const fetchEvents = async () => {
      // daemon_status is not yet in the auto-generated database.types.ts.
      // TODO: regenerate database.types.ts after applying the migration in
      //       hyperway-backend/supabase/migrations/20240101_daemon_status.sql
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("daemon_status")
        .select("*")
        .eq("provider_address", providerAddress.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(MAX_LOG_ENTRIES);

      if (!error && data) {
        setEvents(data as DaemonEvent[]);
        updateOnlineStatus(data as DaemonEvent[]);
      }
      setLoading(false);
    };

    fetchEvents();

    // ── Realtime subscription ──
    const channel = supabase
      .channel(`daemon-status-${providerAddress}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "daemon_status",
          filter: `provider_address=eq.${providerAddress.toLowerCase()}`,
        },
        (payload) => {
          const newEvent = payload.new as DaemonEvent;
          setEvents((prev) => {
            const updated = [newEvent, ...prev].slice(0, MAX_LOG_ENTRIES);
            updateOnlineStatus(updated);
            return updated;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerAddress, updateOnlineStatus]);

  // ── Derive current pipeline stage ──

  const latestJobEvent = events.find(
    (e) => e.event_type !== "heartbeat" && e.job_id !== null,
  );

  const isProcessing =
    latestJobEvent?.event_type === "job_in_progress" ||
    latestJobEvent?.event_type === "job_init" ||
    latestJobEvent?.event_type === "job_proof_tx";

  // ── Status indicator ──

  const statusConfig =
    isOnline === null || loading
      ? { label: "Loading…", dot: "bg-gray-500", text: "text-gray-400" }
      : isProcessing
        ? {
            label: "Processing",
            dot: "bg-yellow-400 animate-pulse",
            text: "text-yellow-400",
          }
        : isOnline
          ? {
              label: "Online",
              dot: "bg-green-400 animate-pulse",
              text: "text-green-400",
            }
          : { label: "Offline", dot: "bg-red-500", text: "text-red-400" };

  // ── Render ──

  return (
    <div className="neo-card !p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Daemon Status</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`} />
          <span className={`text-sm font-bold ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Last heartbeat */}
      <p className="text-xs text-gray-500 mb-4">
        {lastHeartbeat
          ? `Last heartbeat: ${timeAgo(lastHeartbeat)}`
          : loading
            ? "Fetching status…"
            : "No heartbeat received yet"}
      </p>

      {/* Current pipeline stage */}
      {latestJobEvent && isProcessing && (
        <div className="p-3 rounded-xl bg-yellow-500/10 border-2 border-yellow-600 mb-4">
          <p className="text-xs font-bold text-yellow-400 mb-0.5">
            Active Job #{latestJobEvent.job_id}
          </p>
          <p className="text-xs text-gray-300">{latestJobEvent.message}</p>
        </div>
      )}

      {/* Activity log */}
      <div>
        <p className="text-[11px] text-gray-500 uppercase font-bold mb-2">
          Activity Log
        </p>
        {loading ? (
          <p className="text-xs text-gray-600 italic">Loading…</p>
        ) : events.length === 0 ? (
          <p className="text-xs text-gray-600 italic">
            No activity yet. Start your daemon to see live updates.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {events
              .filter((e) => e.event_type !== "heartbeat")
              .map((e) => {
                const cfg = EVENT_CONFIG[e.event_type];
                return (
                  <div
                    key={e.id}
                    className="flex items-start gap-2 text-xs text-gray-400"
                  >
                    <span className="shrink-0 mt-0.5">{cfg.icon}</span>
                    <span className={`font-bold ${cfg.color} shrink-0`}>
                      {cfg.label}
                    </span>
                    <span className="truncate flex-1">{e.message}</span>
                    <span className="shrink-0 text-gray-600 text-[10px]">
                      {timeAgo(e.created_at)}
                    </span>
                  </div>
                );
              })}
            {events.filter((e) => e.event_type !== "heartbeat").length ===
              0 && (
              <p className="text-xs text-gray-600 italic">
                Only heartbeats so far — no jobs processed.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
