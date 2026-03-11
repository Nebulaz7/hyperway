import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerStateService } from './indexer.state';
import { ProviderRegisteredHandler } from './handlers/provider-registered.handler';
import { JobSubmittedHandler } from './handlers/job-submitted.handler';
import { JobAssignedHandler } from './handlers/job-assigned.handler';
import { ProofSubmittedHandler } from './handlers/proof-submitted.handler';
import { JobCompletedHandler } from './handlers/job-completed.handler';
import { JobFailedHandler } from './handlers/job-failed.handler';
import { JobDisputedHandler } from './handlers/job-disputed.handler';
import { DisputeResolvedHandler } from './handlers/dispute-resolved.handler';
import { ProviderSlashedHandler } from './handlers/provider-slashed.handler';
import {
  ProviderDeactivatedHandler,
  ProviderReactivatedHandler,
  StakeWithdrawnHandler,
  GPUSpecsUpdatedHandler,
} from './handlers/provider-lifecycle.handler';
import { ConfigModule } from '@nestjs/config';

// Registers the indexer orchestrator, state service, and all event handlers as Nest providers.

@Module({
  imports: [ConfigModule],
  providers: [
    IndexerService,
    IndexerStateService,
    ProviderRegisteredHandler,
    JobSubmittedHandler,
    JobAssignedHandler,
    ProofSubmittedHandler,
    JobCompletedHandler,
    JobFailedHandler,
    JobDisputedHandler,
    DisputeResolvedHandler,
    ProviderSlashedHandler,
    ProviderDeactivatedHandler,
    ProviderReactivatedHandler,
    StakeWithdrawnHandler,
    GPUSpecsUpdatedHandler,
  ],
})
export class IndexerModule {}