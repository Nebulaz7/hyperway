// ============================================
// Auto-generated types for Supabase tables
// Regenerate with: npx supabase gen types typescript
// ============================================

export type JobStatus =
  | "PENDING"
  | "ASSIGNED"
  | "COMPLETED"
  | "FAILED"
  | "DISPUTED";

export interface Database {
  public: {
    Tables: {
      providers: {
        Row: {
          address: string;
          staked_amount: number;
          gpu_specs: Record<string, unknown>;
          reputation: number;
          jobs_completed: number;
          jobs_failed: number;
          is_active: boolean;
          registered_at: string;
          last_block: number | null;
          last_tx_hash: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["providers"]["Row"]> & {
          address: string;
        };
        Update: Partial<Database["public"]["Tables"]["providers"]["Row"]>;
      };

      jobs: {
        Row: {
          job_id: number;
          buyer: string;
          provider: string | null;
          spec_cid: string;
          result_cid: string | null;
          payment_amount: number;
          compute_units: number;
          status: JobStatus;
          is_xcm_payment: boolean;
          created_at: string;
          assigned_at: string | null;
          completed_at: string | null;
          deadline: string | null;
          created_block: number | null;
          created_tx_hash: string | null;
          last_block: number | null;
          last_tx_hash: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]> & {
          job_id: number;
          buyer: string;
          spec_cid: string;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };

      events: {
        Row: {
          id: number;
          event_name: string;
          block_number: number;
          tx_hash: string;
          log_index: number;
          from_address: string | null;
          args: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      };

      marketplace_stats: {
        Row: {
          id: boolean;
          provider_count: number;
          total_jobs: number;
          completed_jobs: number;
          total_volume_wei: number;
          last_block: number;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["marketplace_stats"]["Row"]
        >;
        Update: Partial<
          Database["public"]["Tables"]["marketplace_stats"]["Row"]
        >;
      };

      indexer_state: {
        Row: {
          id: boolean;
          last_block: number;
          last_tx_hash: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["indexer_state"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["indexer_state"]["Row"]>;
      };
    };
    Enums: {
      job_status: JobStatus;
    };
  };
}
