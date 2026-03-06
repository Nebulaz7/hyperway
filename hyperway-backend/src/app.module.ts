import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import configuration, { validationSchema } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    IndexerModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
