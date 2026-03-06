import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JobCompletedHandler {
  private readonly logger = new Logger(JobCompletedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    provider: string;
    providerPayment: bigint;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    // Update job status
    const { error: jobError } = await this.supabase
      .getClient()
      .from('jobs')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      })
      .eq('job_id', args.jobId.toString());

    if (jobError) {
      this.logger.error(
        `JobCompleted job update failed for job ${args.jobId}: ${jobError.message}`,
      );
      throw jobError;
    }

    // Increment provider total_jobs_completed
    const { error: providerError } = await this.supabase
      .getClient()
      .rpc('increment_provider_completed', {
        p_address: args.provider.toLowerCase(),
      });

    if (providerError) {
      // Non-fatal — log and continue, job status is already updated
      this.logger.warn(
        `Could not increment provider stats for ${args.provider}: ${providerError.message}`,
      );
    }

    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'JOB_COMPLETED',
      data: {
        provider: args.provider.toLowerCase(),
        provider_payment: args.providerPayment.toString(),
      },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(`Job #${args.jobId} completed by ${args.provider}`);
  }
}