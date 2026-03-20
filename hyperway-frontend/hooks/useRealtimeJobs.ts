"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import type { Database } from "@/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = Database["public"]["Enums"]["job_status"]; // ← add this
type ProviderRow = Database["public"]["Tables"]["providers"]["Row"];
type StatsRow = Database["public"]["Tables"]["marketplace_stats"]["Row"];
type EventRow = Database["public"]["Tables"]["events"]["Row"];

// ═══════════════════════════════════════
//  REALTIME: Jobs
// ═══════════════════════════════════════

/** Subscribe to all jobs with optional status filter */
export function useRealtimeJobs(statusFilter?: JobStatus) {
  // ← use JobStatus
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchJobs = async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (data) setJobs(data);
      setLoading(false);
    };

    fetchJobs();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("jobs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newJob = payload.new as JobRow;
            if (!statusFilter || newJob.status === statusFilter) {
              setJobs((prev) => [newJob, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as JobRow;
            setJobs((prev) =>
              prev
                .map((j) => (j.job_id === updated.job_id ? updated : j))
                .filter((j) => !statusFilter || j.status === statusFilter),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter]);

  return { jobs, loading };
}

/** Subscribe to jobs for a specific buyer address */
export function useRealtimeBuyerJobs(buyerAddress: string | undefined) {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerAddress) {
      setLoading(false);
      return;
    }

    const addr = buyerAddress.toLowerCase();

    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("buyer_address", addr)
        .order("created_at", { ascending: false });

      if (data) setJobs(data);
      setLoading(false);
    };

    fetchJobs();

    const channel = supabase
      .channel(`buyer-jobs-${addr}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: `buyer_address=eq.${addr}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setJobs((prev) => [payload.new as JobRow, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as JobRow;
            setJobs((prev) =>
              prev.map((j) => (j.job_id === updated.job_id ? updated : j)),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buyerAddress]);

  return { jobs, loading };
}

/** Subscribe to jobs for a specific provider address */
export function useRealtimeProviderJobs(providerAddress: string | undefined) {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerAddress) {
      setLoading(false);
      return;
    }

    const addr = providerAddress.toLowerCase();

    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_address", addr)
        .order("created_at", { ascending: false });

      if (data) setJobs(data);
      setLoading(false);
    };

    fetchJobs();

    const channel = supabase
      .channel(`provider-jobs-${addr}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: `provider_address=eq.${addr}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setJobs((prev) => [payload.new as JobRow, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as JobRow;
            setJobs((prev) =>
              prev.map((j) => (j.job_id === updated.job_id ? updated : j)),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerAddress]);

  return { jobs, loading };
}

// ═══════════════════════════════════════
//  REALTIME: Providers
// ═══════════════════════════════════════

/** Subscribe to active providers */
export function useRealtimeProviders() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase
        .from("providers")
        .select("*")
        .eq("is_active", true)
        .order("reputation", { ascending: false });

      if (data) setProviders(data);
      setLoading(false);
    };

    fetchProviders();

    const channel = supabase
      .channel("providers-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "providers" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newProvider = payload.new as ProviderRow;
            if (newProvider.is_active) {
              setProviders((prev) => [newProvider, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as ProviderRow;
            setProviders((prev) => {
              const filtered = prev.filter(
                (p) => p.address !== updated.address,
              );
              if (updated.is_active) {
                return [...filtered, updated].sort(
                  (a, b) => b.reputation - a.reputation,
                );
              }
              return filtered;
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { providers, loading };
}

// ═══════════════════════════════════════
//  REALTIME: Marketplace Stats
// ═══════════════════════════════════════

/** Subscribe to aggregate marketplace stats */
export function useRealtimeStats() {
  const [stats, setStats] = useState<StatsRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("marketplace_stats")
        .select("*")
        .limit(1)
        .single();

      if (data) setStats(data);
      setLoading(false);
    };

    fetchStats();

    const channel = supabase
      .channel("stats-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "marketplace_stats" },
        (payload) => {
          setStats(payload.new as StatsRow);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading };
}

// ═══════════════════════════════════════
//  REALTIME: Activity Feed
// ═══════════════════════════════════════

/** Subscribe to the latest events (activity feed) */
export function useRealtimeActivity(limit: number = 20) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();

    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          setEvents((prev) =>
            [payload.new as EventRow, ...prev].slice(0, limit),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { events, loading };
}
