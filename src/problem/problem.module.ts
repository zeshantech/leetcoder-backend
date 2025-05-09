import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemService } from './problem.service';
import { ProblemResolver } from './problem.resolver';
import { Problem, ProblemList, ProblemTestCase } from './entities/problem.entity';
import { ProblemListService } from './problem-list.service';
import { ProblemListResolver } from './problem-list.resolver';
import { ProblemProgressResolver } from './problem-progress.resolver';
import { ProblemListRepository } from './problem-list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, ProblemList, ProblemTestCase])],
  providers: [ProblemService, ProblemResolver, ProblemListService, ProblemListResolver, ProblemProgressResolver, ProblemListRepository],
  exports: [ProblemService],
})
export class ProblemModule {}
