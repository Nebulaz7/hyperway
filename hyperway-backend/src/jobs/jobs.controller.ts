import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('buyer') buyer?: string,
    @Query('provider') provider?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.jobs.findAll({
      status,
      buyer,
      provider,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobs.findOne(id);
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }
}