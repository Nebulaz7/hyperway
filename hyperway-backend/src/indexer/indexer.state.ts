import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

// Stores and retrieves the last indexed block so polling can resume safely across restarts.
@Injectable()
export class IndexerStateService {
  private readonly logger = new Logger(IndexerStateService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  async getLastIndexedBlock(): Promise<bigint> {
    const { data, error } = await this.supabase
      .getClient()
      .from('indexer_state')
      .select('last_block')
      .eq('id', 1)
      .single();

    if (error || !data) {
      // First run — start from deployment block
      const startBlock = this.config.get<bigint>('blockchain.startBlock')!;
      this.logger.log(
        `No indexer state found, starting from block ${startBlock}`,
      );
      return startBlock;
    }

    return BigInt(data.last_block);
  }

  async updateLastIndexedBlock(block: bigint): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('indexer_state')
      .upsert({ id: 1, last_block: block.toString(), updated_at: new Date().toISOString() });

    if (error) {
      this.logger.error(`Failed to update last indexed block: ${error.message}`);
      throw error;
    }
  }
}