import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemResolver } from './problem.resolver';

@Module({
  providers: [ProblemResolver, ProblemService],
})
export class ProblemModule {}
