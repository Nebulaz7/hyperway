import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JobDisputedHandler {
  private readonly logger = new Logger(JobDisputedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    buyer: string;
    reason: string;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('jobs')
      .update({ status: 'DISPUTED' })
      .eq('job_id', args.jobId.toString());

    if (error) {
      this.logger.error(
        `JobDisputed handler failed for job ${args.jobId}: ${error.message}`,
      );
      throw error;
    }

    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'JOB_DISPUTED',
      data: {
        buyer: args.buyer.toLowerCase(),
        reason: args.reason,
      },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(`Job #${args.jobId} disputed by ${args.buyer}`);
  }
}