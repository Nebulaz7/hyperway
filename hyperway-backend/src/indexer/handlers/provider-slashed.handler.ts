import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

// Applies slashing penalties by decrementing provider stake and recording a platform-level slash event.
@Injectable()
export class ProviderSlashedHandler {
  private readonly logger = new Logger(ProviderSlashedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    provider: string;
    slashAmount: bigint;
    reason: string;
    blockNumber: bigint;
    txHash: string;
  }): Promise<void> {
    // Decrement staked_amount — use RPC to avoid race conditions
    const { error: stakeError } = await this.supabase
      .getClient()
      .rpc('decrement_provider_stake', {
        p_address: args.provider.toLowerCase(),
        p_amount: args.slashAmount.toString(),
      });

    if (stakeError) {
      this.logger.error(
        `ProviderSlashed stake update failed for ${args.provider}: ${stakeError.message}`,
      );
      throw stakeError;
    }

    // Write to job_events as a platform-level event (no job_id)
    await this.supabase.getClient().from('job_events').insert({
      job_id: null,
      event_type: 'PROVIDER_SLASHED',
      data: {
        provider: args.provider.toLowerCase(),
        slash_amount: args.slashAmount.toString(),
        reason: args.reason,
      },
      block_number: args.blockNumber.toString(),
      tx_hash: args.txHash,
    });

    this.logger.log(
      `Provider ${args.provider} slashed ${args.slashAmount} — reason: ${args.reason}`,
    );
  }
}