import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { IndexerModule } from './indexer/indexer.module';
import { SupabaseModule } from './supabase/supabase.module';
import configuration, { validationSchema } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    SupabaseModule,
    IndexerModule,
  ],
})
export class AppModule {}