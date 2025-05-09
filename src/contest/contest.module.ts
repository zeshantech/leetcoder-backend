import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestService } from './contest.service';
import { ContestResolver } from './contest.resolver';
import { ContestRepository } from './contest.repository';
import { ContestRegistrationRepository } from './contest-registration.repository';
import { Contest } from './entities/contest.entity';
import { ContestRegistration } from './entities/contest-registration.entity';
import { Problem } from '../problem/entities/problem.entity';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  imports: [ProblemModule, TypeOrmModule.forFeature([Contest, ContestRegistration, Problem])],
  providers: [ContestService, ContestResolver, ContestRepository, ContestRegistrationRepository],
  exports: [ContestService],
})
export class ContestModule {}
