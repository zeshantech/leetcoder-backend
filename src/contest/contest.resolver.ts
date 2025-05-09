import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ContestService } from './contest.service';
import { Contest } from './entities/contest.entity';
import { GetContestsOutput, ContestLeaderboardOutput, ContestEligibilityOutput, GetContestProblemsOutput } from './dto/contest.output';
import { CreateContestInput, UpdateContestInput, GetContestsInput, GetContestLeaderboardInput, AddProblemToContestInput, RemoveProblemFromContestInput } from './dto/contest.input';
import { MessageOutput } from 'src/common/dto/output.dto';
import { IDInput, PaginationInput } from 'src/common/dto/input.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/types/common.types';
import { ContestRegistration } from './entities/contest-registration.entity';

@Resolver(() => Contest)
export class ContestResolver {
  constructor(private readonly contestService: ContestService) {}

  @Query(() => GetContestsOutput)
  async getAllContests(@Args('input', { nullable: true }) input: GetContestsInput) {
    return this.contestService.getAllContests(input);
  }

  @Query(() => GetContestsOutput)
  async getUpcomingContests(@Args('input', { nullable: true }) input: PaginationInput) {
    return this.contestService.getUpcomingContests(input);
  }

  @Query(() => GetContestsOutput)
  async getOngoingContests(@Args('input', { nullable: true }) input: PaginationInput) {
    return this.contestService.getOngoingContests(input);
  }

  @Query(() => Contest)
  async getContest(@Args('params') params: IDInput) {
    return this.contestService.getContest({ id: params.id }, { relations: ['problems'] });
  }

  @Query(() => ContestEligibilityOutput)
  @UseGuards(AuthGuard)
  async checkContestEligibility(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    return this.contestService.checkUserEligibility(params.id, user);
  }

  @Mutation(() => Contest)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createContest(@Args('input') input: CreateContestInput) {
    return this.contestService.createContest(input);
  }

  @Mutation(() => Contest)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateContest(@Args('params') params: IDInput, @Args('input') input: UpdateContestInput) {
    return this.contestService.updateContest(params.id, input);
  }

  @Mutation(() => MessageOutput)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteContest(@Args('params') params: IDInput) {
    await this.contestService.deleteContest(params.id);

    return { message: 'Contest deleted successfully' };
  }

  @Mutation(() => ContestRegistration)
  @UseGuards(AuthGuard)
  async registerForContest(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    return this.contestService.registerForContest(params.id, user);
  }

  @Query(() => GetContestProblemsOutput)
  @UseGuards(AuthGuard)
  async getContestProblems(@Args('params') params: IDInput) {
    return this.contestService.getContestProblems(params.id);
  }

  @Query(() => ContestLeaderboardOutput)
  async getContestLeaderboard(@Args('input') input: GetContestLeaderboardInput) {
    return this.contestService.getContestLeaderboard(input);
  }

  @Mutation(() => Contest)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async addProblemToContest(@Args('input') input: AddProblemToContestInput) {
    return this.contestService.addProblemToContest(input.contestId, input.problemId);
  }

  @Mutation(() => Contest)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeProblemFromContest(@Args('input') input: RemoveProblemFromContestInput) {
    return this.contestService.removeProblemFromContest(input.contestId, input.problemId);
  }

  @Query(() => GetContestsOutput)
  @UseGuards(AuthGuard)
  async getUserContestParticipation(@Args('input', { nullable: true }) input: PaginationInput, @CurrentUser() user: CurrentUser) {
    return this.contestService.getUserContestParticipation(input, user);
  }

  @Query(() => MessageOutput)
  @UseGuards(AuthGuard)
  async getUserContestSubmissions(@Args('params') params: IDInput, @Args('input', { nullable: true }) input: PaginationInput, @CurrentUser() user: CurrentUser) {
    return this.contestService.getUserContestSubmissions(params.id, input, user);
  }

  @Mutation(() => MessageOutput)
  @UseGuards(AuthGuard)
  async updateUserContestScore(@Args('params') params: IDInput, @Args('points') points: number, @CurrentUser() user: CurrentUser) {
    await this.contestService.updateContestScore(params.id, points, user);
    return { message: 'Contest score updated successfully' };
  }
}
