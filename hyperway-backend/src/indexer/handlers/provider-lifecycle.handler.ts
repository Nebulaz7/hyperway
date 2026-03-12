import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

// Groups provider lifecycle handlers that toggle activity, handle withdrawals, and update GPU metadata.
@Injectable()
export class ProviderDeactivatedHandler {
  private readonly logger = new Logger(ProviderDeactivatedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: { provider: string }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('providers')
      .update({ is_active: false })
      .eq('wallet_address', args.provider.toLowerCase());

    if (error) {
      this.logger.error(
        `ProviderDeactivated failed for ${args.provider}: ${error.message}`,
      );
      throw error;
    }

    this.logger.log(`Provider deactivated: ${args.provider}`);
  }
}

@Injectable()
export class ProviderReactivatedHandler {
  private readonly logger = new Logger(ProviderReactivatedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: { provider: string }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('providers')
      .update({ is_active: true })
      .eq('wallet_address', args.provider.toLowerCase());

    if (error) {
      this.logger.error(
        `ProviderReactivated failed for ${args.provider}: ${error.message}`,
      );
      throw error;
    }

    this.logger.log(`Provider reactivated: ${args.provider}`);
  }
}

@Injectable()
export class StakeWithdrawnHandler {
  private readonly logger = new Logger(StakeWithdrawnHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: { provider: string; amount: bigint }): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('providers')
      .update({ staked_amount: '0', is_active: false })
      .eq('wallet_address', args.provider.toLowerCase());

    if (error) {
      this.logger.error(
        `StakeWithdrawn failed for ${args.provider}: ${error.message}`,
      );
      throw error;
    }

    this.logger.log(
      `Stake withdrawn for ${args.provider}: ${args.amount}`,
    );
  }
}

@Injectable()
export class GPUSpecsUpdatedHandler {
  private readonly logger = new Logger(GPUSpecsUpdatedHandler.name);

  constructor(private readonly supabase: SupabaseService) {}

  async handle(args: {
    provider: string;
    newSpecs: `0x${string}`;
  }): Promise<void> {
    let gpuSpecsParsed: Record<string, unknown> = {};
    try {
      const hex = args.newSpecs.replace('0x', '');
      const decoded = Buffer.from(hex, 'hex').toString('utf8');
      gpuSpecsParsed = JSON.parse(decoded);
    } catch {
      this.logger.warn(
        `Could not parse newSpecs for provider ${args.provider}`,
      );
    }

    const { error } = await this.supabase
      .getClient()
      .from('providers')
      .update({ gpu_specs: gpuSpecsParsed })
      .eq('wallet_address', args.provider.toLowerCase());

    if (error) {
      this.logger.error(
        `GPUSpecsUpdated failed for ${args.provider}: ${error.message}`,
      );
      throw error;
    }

    this.logger.log(`GPU specs updated for ${args.provider}`);
  }
}