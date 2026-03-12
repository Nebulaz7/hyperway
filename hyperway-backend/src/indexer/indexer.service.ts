import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { createPublicClient, http, parseAbiItem, decodeEventLog } from 'viem';
import { CONTRACT_ABI } from '../config/contract';
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

// Polls on-chain contract logs, decodes events, and routes each event to the correct persistence handler.
@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private isRunning = false;
  private client: ReturnType<typeof createPublicClient>;
  private contractAddress: `0x${string}`;

  // Max blocks to fetch per poll — avoids RPC timeouts on catch-up
  private readonly BLOCK_RANGE = 500n;

  constructor(
    private readonly config: ConfigService,
    private readonly state: IndexerStateService,
    private readonly providerRegistered: ProviderRegisteredHandler,
    private readonly jobSubmitted: JobSubmittedHandler,
    private readonly jobAssigned: JobAssignedHandler,
    private readonly proofSubmitted: ProofSubmittedHandler,
    private readonly jobCompleted: JobCompletedHandler,
    private readonly jobFailed: JobFailedHandler,
    private readonly jobDisputed: JobDisputedHandler,
    private readonly disputeResolved: DisputeResolvedHandler,
    private readonly providerSlashed: ProviderSlashedHandler,
    private readonly providerDeactivated: ProviderDeactivatedHandler,
    private readonly providerReactivated: ProviderReactivatedHandler,
    private readonly stakeWithdrawn: StakeWithdrawnHandler,
    private readonly gpuSpecsUpdated: GPUSpecsUpdatedHandler,
  ) {}

  onModuleInit() {
    this.contractAddress = this.config.get<string>(
      'blockchain.contractAddress',
    )! as `0x${string}`;

    this.client = createPublicClient({
      transport: http(this.config.get<string>('blockchain.rpcUrl')!),
    });

    this.logger.log(
      `Indexer initialized — contract: ${this.contractAddress}`,
    );
  }

  @Cron('*/10 * * * * *') // every 10 seconds
  async poll() {
    if (this.isRunning) {
      this.logger.debug('Poll skipped — previous run still in progress');
      return;
    }

    this.isRunning = true;

    try {
      const latestBlock = await this.client.getBlockNumber();
      const lastIndexed = await this.state.getLastIndexedBlock();

      if (lastIndexed >= latestBlock) {
        return; // Nothing new
      }

      // Process in chunks to avoid RPC limits
      let fromBlock = lastIndexed + 1n;

      while (fromBlock <= latestBlock) {
        const toBlock =
          fromBlock + this.BLOCK_RANGE - 1n < latestBlock
            ? fromBlock + this.BLOCK_RANGE - 1n
            : latestBlock;

        await this.processBlockRange(fromBlock, toBlock);
        await this.state.updateLastIndexedBlock(toBlock);

        fromBlock = toBlock + 1n;
      }
    } catch (err) {
      this.logger.error(`Poll error: ${(err as Error).message}`);
      // Don't rethrow — keep the cron alive
    } finally {
      this.isRunning = false;
    }
  }

  private async processBlockRange(
    fromBlock: bigint,
    toBlock: bigint,
  ): Promise<void> {
    this.logger.debug(`Processing blocks ${fromBlock} → ${toBlock}`);

    const logs = await this.client.getLogs({
      address: this.contractAddress,
      fromBlock,
      toBlock,
    });

    if (logs.length === 0) return;

    // Sort by block then log index for deterministic ordering
    const sorted = [...logs].sort((a, b) => {
      const blockDiff = Number(a.blockNumber - b.blockNumber);
      if (blockDiff !== 0) return blockDiff;
      return Number(a.logIndex - b.logIndex);
    });

    for (const log of sorted) {
      try {
        await this.dispatchLog(log);
      } catch (err) {
        // Log and continue — don't let one bad event kill the batch
        this.logger.error(
          `Handler error for tx ${log.transactionHash} log ${log.logIndex}: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `Processed ${sorted.length} events in blocks ${fromBlock}–${toBlock}`,
    );
  }

  private async dispatchLog(log: any): Promise<void> {
    let decoded: any;
    try {
      decoded = decodeEventLog({
        abi: CONTRACT_ABI,
        data: log.data,
        topics: log.topics,
      });
    } catch {
      // Unknown event — skip silently
      return;
    }

    const base = {
      blockNumber: log.blockNumber as bigint,
      txHash: log.transactionHash as string,
    };

    const { eventName, args } = decoded;

    switch (eventName) {
      case 'ProviderRegistered':
        await this.providerRegistered.handle({
          provider: args.provider,
          stakedAmount: args.stakedAmount,
          gpuSpecs: args.gpuSpecs,
        });
        break;

      case 'JobSubmitted':
        await this.jobSubmitted.handle({
          jobId: args.jobId,
          buyer: args.buyer,
          specCID: args.specCID,
          payment: args.payment,
          ...base,
        });
        break;

      case 'XCMJobSubmitted':
        // Same handler, 0 payment for XCM jobs (paid via XCM transfer)
        await this.jobSubmitted.handle({
          jobId: args.jobId,
          buyer: args.buyer,
          specCID: args.specCID,
          payment: 0n,
          ...base,
        });
        break;

      case 'JobAssigned':
        await this.jobAssigned.handle({
          jobId: args.jobId,
          provider: args.provider,
          ...base,
        });
        break;

      case 'ProofSubmitted':
        await this.proofSubmitted.handle({
          jobId: args.jobId,
          resultCID: args.resultCID,
          ...base,
        });
        break;

      case 'JobCompleted':
        await this.jobCompleted.handle({
          jobId: args.jobId,
          provider: args.provider,
          providerPayment: args.providerPayment,
          ...base,
        });
        break;

      case 'JobFailed':
        await this.jobFailed.handle({
          jobId: args.jobId,
          provider: args.provider,
          ...base,
        });
        break;

      case 'JobDisputed':
        await this.jobDisputed.handle({
          jobId: args.jobId,
          buyer: args.buyer,
          reason: args.reason,
          ...base,
        });
        break;

      case 'DisputeResolved':
        await this.disputeResolved.handle({
          jobId: args.jobId,
          buyerWins: args.buyerWins,
          ...base,
        });
        break;

      case 'ProviderSlashed':
        await this.providerSlashed.handle({
          provider: args.provider,
          slashAmount: args.slashAmount,
          reason: args.reason,
          ...base,
        });
        break;

      case 'StakeWithdrawn':
        await this.stakeWithdrawn.handle({
          provider: args.provider,
          amount: args.amount,
        });
        break;

      case 'ProviderDeactivated':
        await this.providerDeactivated.handle({ provider: args.provider });
        break;

      case 'ProviderReactivated':
        await this.providerReactivated.handle({ provider: args.provider });
        break;

      case 'GPUSpecsUpdated':
        await this.gpuSpecsUpdated.handle({
          provider: args.provider,
          newSpecs: args.newSpecs,
        });
        break;

      default:
        // Admin events (FeeRecipientUpdated etc.) — ignore
        break;
    }
  }
}