import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class ProviderRegisteredHandler {
  private readonly logger = new Logger(ProviderRegisteredHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    provider: string;
    stakedAmount: bigint;
    gpuSpecs: `0x${string}`;
  }): Promise<void> {
    // gpuSpecs is bytes on-chain — decode hex to UTF-8 string
    let gpuSpecsParsed: Record<string, unknown> = {};
    try {
      const hex = args.gpuSpecs.replace('0x', '');
      const decoded = Buffer.from(hex, 'hex').toString('utf8');
      gpuSpecsParsed = JSON.parse(decoded);
    } catch {
      this.logger.warn(
        `Could not parse gpuSpecs for provider ${args.provider}`,
      );
    }

    const { error } = await this.supabase
      .getClient()
      .from('providers')
      .upsert(
        {
          wallet_address: args.provider.toLowerCase(),
          staked_amount: args.stakedAmount.toString(),
          gpu_specs: gpuSpecsParsed,
          reputation_score: 50,
          total_jobs_completed: 0,
          total_jobs_failed: 0,
          is_active: true,
          registered_at: new Date().toISOString(),
        },
        { onConflict: 'wallet_address' },
      );

    if (error) {
      this.logger.error(
        `ProviderRegistered handler failed for ${args.provider}: ${error.message}`,
      );
      throw error;
    }

    this.logger.log(`Provider registered: ${args.provider}`);
  }
}