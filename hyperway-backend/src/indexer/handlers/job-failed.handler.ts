import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JobFailedHandler {
  private readonly logger = new Logger(JobFailedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    provider: string;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    const { error: jobError } = await this.supabase
      .getClient()
      .from('jobs')
      .update({ status: 'FAILED' })
      .eq('job_id', args.jobId.toString());

    if (jobError) {
      this.logger.error(
        `JobFailed handler failed for job ${args.jobId}: ${jobError.message}`,
      );
      throw jobError;
    }

    // Increment provider total_jobs_failed
    const { error: providerError } = await this.supabase
      .getClient()
      .rpc('increment_provider_failed', {
        p_address: args.provider.toLowerCase(),
      });

    if (providerError) {
      this.logger.warn(
        `Could not increment provider failed stats for ${args.provider}: ${providerError.message}`,
      );
    }

    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'JOB_FAILED',
      data: { provider: args.provider.toLowerCase() },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(`Job #${args.jobId} failed, provider ${args.provider}`);
  }
}