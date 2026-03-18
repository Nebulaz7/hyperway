import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

  @Get()
  findAll(
    @Query('active') active?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.providers.findAll({
      active: active !== 'false', // default to active only
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get(':address/daemon')
  async getDaemonStatus(@Param('address') address: string) {
    return this.providers.getDaemonStatus(address);
  }

  @Get(':address')
  async findOne(@Param('address') address: string) {
    const provider = await this.providers.findOne(address);
    if (!provider) throw new NotFoundException(`Provider ${address} not found`);
    return provider;
  }
}