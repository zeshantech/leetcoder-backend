import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProblemStatus } from '../common/types/common.types';
import { ProblemStatsOutput, UserProblemsStatusOutput, UserStreakOutput } from './dto/problem.output';
import { IDInput } from 'src/common/dto/input.dto';
@Resolver()
export class ProblemProgressResolver {
  @Query(() => UserProblemsStatusOutput)
  @UseGuards(AuthGuard)
  async userProblemStatus(@CurrentUser() user: CurrentUser): Promise<UserProblemsStatusOutput> {
    // This would need implementation in the problem service
    // For now we'll return a stub
    return {
      success: true,
      solvedCount: 0,
      attemptedCount: 0,
      totalCount: 0,
      solvedProblemIds: [],
      attemptedProblemIds: [],
    };
  }

  @Query(() => ProblemStatsOutput)
  @UseGuards(AuthGuard)
  async problemStats(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser): Promise<ProblemStatsOutput> {
    // This would need implementation in the problem service
    // For now we'll return a stub
    return {
      success: true,
      problemId: params.id,
      status: ProblemStatus.NOT_STARTED,
      submissionCount: 0,
      acceptedCount: 0,
      acceptanceRate: 0,
      lastSubmitted: new Date(),
    };
  }

  @Query(() => UserStreakOutput)
  @UseGuards(AuthGuard)
  async userStreak(@CurrentUser() user: CurrentUser) {
    // This would need implementation in a user or stats service
    return {
      success: true,
      currentStreak: 0,
      maxStreak: 0,
      totalActiveDays: 0,
    };
  }
}
