import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url =
      this.config.get<string>('supabase.url') ??
      this.config.get<string>('SUPABASE_URL');
    const serviceKey =
      this.config.get<string>('supabase.serviceKey') ??
      this.config.get<string>('SUPABASE_SERVICE_KEY');

    if (!url || !serviceKey) {
      throw new Error(
        'Supabase configuration is missing. Expected SUPABASE_URL and SUPABASE_SERVICE_KEY.',
      );
    }

    this.client = createClient(
      url,
      serviceKey,
    );
    this.logger.log('Supabase client initialized');
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}