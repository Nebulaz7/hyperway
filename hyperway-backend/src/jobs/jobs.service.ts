import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(filters: {
    status?: string;
    buyer?: string;
    provider?: string;
    limit: number;
    offset: number;
  }) {
    let query = this.supabase
      .getClient()
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (filters.status) {
      query = query.eq('status', filters.status.toUpperCase());
    }
    if (filters.buyer) {
      query = query.eq('buyer_address', filters.buyer.toLowerCase());
    }
    if (filters.provider) {
      query = query.eq('provider_address', filters.provider.toLowerCase());
    }

    const { data, error, count } = await query;

    if (error) {
      this.logger.error(`findAll error: ${error.message}`);
      throw error;
    }

    return { data, total: count };
  }

  async findOne(jobId: string) {
    // Accept either UUID (our internal id) or on-chain job_id number
    const isOnChainId = /^\d+$/.test(jobId);

    const { data: job, error } = await this.supabase
      .getClient()
      .from('jobs')
      .select('*')
      .eq(isOnChainId ? 'job_id' : 'id', jobId)
      .single();

    if (error || !job) return null;

    // Fetch significant events for this job
    const { data: events } = await this.supabase
      .getClient()
      .from('job_events')
      .select('*')
      .eq('job_id', job.job_id)
      .order('created_at', { ascending: true });

    return { ...job, events: events ?? [] };
  }
}