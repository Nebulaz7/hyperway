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
}