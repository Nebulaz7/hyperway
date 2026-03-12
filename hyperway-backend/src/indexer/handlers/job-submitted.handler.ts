import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

// Creates or updates pending jobs from submission events and stores a submission audit record.
@Injectable()
export class JobSubmittedHandler {
  private readonly logger = new Logger(JobSubmittedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    buyer: string;
    specCID: `0x${string}`;
    payment: bigint;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('jobs')
      .upsert(
        {
          job_id: args.jobId.toString(),
          buyer_address: args.buyer.toLowerCase(),
          spec_cid: args.specCID,
          payment_amount: args.payment.toString(),
          status: 'PENDING',
        },
        { onConflict: 'job_id' },
      );

    if (error) {
      this.logger.error(
        `JobSubmitted handler failed for job ${args.jobId}: ${error.message}`,
      );
      throw error;
    }

    // Audit log
    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'JOB_SUBMITTED',
      data: {
        buyer: args.buyer.toLowerCase(),
        spec_cid: args.specCID,
        payment: args.payment.toString(),
      },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(`Job submitted: #${args.jobId} by ${args.buyer}`);
  }
}