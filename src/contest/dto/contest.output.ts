import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Contest } from '../entities/contest.entity';
import { PaginatedOutput } from 'src/common/dto/output.dto';
import { ContestRegistration } from '../entities/contest-registration.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@ObjectType()
export class GetContestsOutput extends PaginatedOutput(Contest) {}

@ObjectType()
export class ContestLeaderboardOutput extends PaginatedOutput(ContestRegistration) {
  @Field(() => Contest)
  contest: Contest;
}

@ObjectType()
export class GetContestProblemsOutput {
  @Field(() => Number)
  problemCount: number;

  @Field(() => [Problem])
  problems: Problem[];
}

@ObjectType()
export class ContestEligibilityOutput {
  @Field(() => Boolean)
  eligible: boolean;

  @Field(() => Boolean, { nullable: true })
  registered?: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Contest)
  contest: Contest;
}
