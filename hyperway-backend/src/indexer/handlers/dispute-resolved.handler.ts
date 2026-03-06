import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DisputeResolvedHandler {
  private readonly logger = new Logger(DisputeResolvedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    buyerWins: boolean;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    // buyerWins=true → refunded → treat as FAILED for provider
    // buyerWins=false → provider vindicated → treat as COMPLETED
    const finalStatus = args.buyerWins ? 'FAILED' : 'COMPLETED';

    const { error } = await this.supabase
      .getClient()
      .from('jobs')
      .update({
        status: finalStatus,
        ...(finalStatus === 'COMPLETED'
          ? { completed_at: new Date().toISOString() }
          : {}),
      })
      .eq('job_id', args.jobId.toString());

    if (error) {
      this.logger.error(
        `DisputeResolved handler failed for job ${args.jobId}: ${error.message}`,
      );
      throw error;
    }

    await this.supabase.getClient().from('job_events').insert({
      job_id: args.jobId.toString(),
      event_type: 'DISPUTE_RESOLVED',
      data: {
        buyer_wins: args.buyerWins,
        final_status: finalStatus,
      },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(
      `Dispute resolved for job #${args.jobId} — buyer wins: ${args.buyerWins}`,
    );
  }
}