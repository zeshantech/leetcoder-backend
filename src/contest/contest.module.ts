import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestResolver } from './contest.resolver';

@Module({
  providers: [ContestResolver, ContestService],
})
export class ContestModule {}
