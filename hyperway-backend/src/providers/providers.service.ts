import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(filters: {
    active: boolean;
    limit: number;
    offset: number;
  }) {
    let query = this.supabase
      .getClient()
      .from('providers')
      .select('*')
      .order('reputation_score', { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (filters.active) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      this.logger.error(`findAll error: ${error.message}`);
      throw error;
    }

    return { data };
  }

  async findOne(address: string) {
    const { data: provider, error } = await this.supabase
      .getClient()
      .from('providers')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (error || !provider) return null;

    // Fetch job history for this provider
    const { data: jobs } = await this.supabase
      .getClient()
      .from('jobs')
      .select('job_id, status, payment_amount, created_at, completed_at')
      .eq('provider_address', address.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(10);

    return { ...provider, recent_jobs: jobs ?? [] };
  }

  async getDaemonStatus(address: string) {
    const normalised = address.toLowerCase();

    const { data, error } = await this.supabase
      .getClient()
      .from('daemon_status')
      .select('*')
      .eq('provider_address', normalised)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      this.logger.error(`getDaemonStatus error: ${error.message}`);
      throw error;
    }

    const events = data ?? [];

    // Daemon is considered online when the last heartbeat was within 90 s.
    // (heartbeat interval = 30 s, so two missed beats before marking offline)
    const lastHeartbeat = events.find((e) => e.event_type === 'heartbeat');
    const isOnline = lastHeartbeat
      ? Date.now() - new Date(lastHeartbeat.created_at as string).getTime() <
        90_000
      : false;

    return {
      isOnline,
      lastHeartbeat: lastHeartbeat?.created_at ?? null,
      events,
    };
  }
}