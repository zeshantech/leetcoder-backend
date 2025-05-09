import { Problem, ProblemList } from '../entities/problem.entity';

import { ID, Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOutput } from 'src/common/dto/output.dto';
import { ProblemStatus } from 'src/common/types/common.types';

@ObjectType()
export class GetAllProblemsOutput extends PaginatedOutput(Problem) {}

@ObjectType()
export class GetAllProblemListsOutput extends PaginatedOutput(ProblemList) {}

@ObjectType()
export class ProblemStatsOutput {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => ID)
  problemId: string;

  @Field()
  status: ProblemStatus;

  @Field()
  submissionCount: number;

  @Field()
  acceptedCount: number;

  @Field()
  acceptanceRate: number;

  @Field()
  lastSubmitted: Date;
}

@ObjectType()
export class UserProblemsStatusOutput {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field()
  solvedCount: number;

  @Field()
  attemptedCount: number;

  @Field()
  totalCount: number;

  @Field(() => [String])
  solvedProblemIds: string[];

  @Field(() => [String])
  attemptedProblemIds: string[];
}

@ObjectType()
export class UserStreakOutput {
  @Field()
  success: boolean;

  @Field()
  currentStreak: number;

  @Field()
  maxStreak: number;

  @Field()
  totalActiveDays: number;
}
