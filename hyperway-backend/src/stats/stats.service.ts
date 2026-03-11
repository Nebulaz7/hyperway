import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async getPlatformStats() {
    const client = this.supabase.getClient();

    // Run all counts in parallel
    const [
      totalJobs,
      pendingJobs,
      assignedJobs,
      completedJobs,
      failedJobs,
      disputedJobs,
      activeProviders,
      totalProviders,
    ] = await Promise.all([
      client.from('jobs').select('*', { count: 'exact', head: true }),
      client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'ASSIGNED'),
      client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
      client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'FAILED'),
      client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'DISPUTED'),
      client.from('providers').select('*', { count: 'exact', head: true }).eq('is_active', true),
      client.from('providers').select('*', { count: 'exact', head: true }),
    ]);

    // Total payment volume from completed jobs
    const { data: volumeData } = await client
      .from('jobs')
      .select('payment_amount')
      .eq('status', 'COMPLETED');

    const totalVolume = (volumeData ?? []).reduce(
      (sum, job) => sum + BigInt(job.payment_amount),
      0n,
    );

    return {
      jobs: {
        total: totalJobs.count ?? 0,
        pending: pendingJobs.count ?? 0,
        assigned: assignedJobs.count ?? 0,
        completed: completedJobs.count ?? 0,
        failed: failedJobs.count ?? 0,
        disputed: disputedJobs.count ?? 0,
      },
      providers: {
        total: totalProviders.count ?? 0,
        active: activeProviders.count ?? 0,
      },
      volume: {
        total_completed_wei: totalVolume.toString(),
      },
    };
  }
}