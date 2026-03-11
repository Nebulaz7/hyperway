import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

// Persists result CID on proof submission so completed jobs can reference the produced output.
@Injectable()
export class ProofSubmittedHandler {
  private readonly logger = new Logger(ProofSubmittedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    jobId: bigint;
    resultCID: `0x${string}`;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('jobs')
      .update({ result_cid: args.resultCID })
      .eq('job_id', args.jobId.toString());

    if (error) {
      this.logger.error(
        `ProofSubmitted handler failed for job ${args.jobId}: ${error.message}`,
      );
      throw error;
    }

    // Not writing to job_events here — JobCompleted fires in the same tx
    // and is the canonical "significant state change" for audit purposes

    this.logger.log(`Proof submitted for job #${args.jobId}`);
  }
}