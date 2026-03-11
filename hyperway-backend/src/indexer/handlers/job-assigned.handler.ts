import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

// Handles JobAssigned events by attaching the provider, setting ASSIGNED status, and logging the assignment.
@Injectable()
export class JobAssignedHandler {
  private readonly logger = new Logger(JobAssignedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    provider: string;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('jobs')
      .update({
        provider_address: args.provider.toLowerCase(),
        status: 'ASSIGNED',
        assigned_at: new Date().toISOString(),
      })
      .eq('job_id', args.jobId.toString());

    if (error) {
      this.logger.error(
        `JobAssigned handler failed for job ${args.jobId}: ${error.message}`,
      );
      throw error;
    }

    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'JOB_ASSIGNED',
      data: { provider: args.provider.toLowerCase() },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(`Job #${args.jobId} assigned to ${args.provider}`);
  }
}