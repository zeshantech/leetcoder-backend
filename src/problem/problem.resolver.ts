import { Resolver, Query, Mutation, Args, ID, Field, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/types/common.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProblemService } from './problem.service';
import { Problem } from './entities/problem.entity';
import { CreateProblemInput, GetProblemsInput, UpdateProblemInput } from './dto/problem.input';
import { MessageOutput } from 'src/common/dto/output.dto';
import { GetAllProblemsOutput } from './dto/problem.output';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IDInput } from 'src/common/dto/input.dto';

@Resolver(() => Problem)
export class ProblemResolver {
  constructor(private readonly problemService: ProblemService) {}

  @Query(() => GetAllProblemsOutput)
  async getAllProblems(@Args('input', { nullable: true }) input: GetProblemsInput) {
    return this.problemService.getAllProblems(input);
  }

  @Query(() => Problem)
  async getProblem(@Args('params') params: IDInput) {
    return this.problemService.getProblem({ id: params.id }, { relations: ['testCases'] });
  }

  @Query(() => [String])
  async problemTags(): Promise<string[]> {
    return this.problemService.getAllTags();
  }

  @Query(() => [String])
  async problemDifficulties() {
    return this.problemService.getAllDifficulties();
  }

  @Mutation(() => Problem)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createProblem(@Args('input') input: CreateProblemInput, @CurrentUser() user: CurrentUser) {
    return this.problemService.createProblem(input, user);
  }

  @Mutation(() => Problem)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateProblem(@Args('params') params: IDInput, @Args('input') input: UpdateProblemInput) {
    return this.problemService.updateProblem(params.id, input);
  }

  @Mutation(() => MessageOutput)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteProblem(@Args('params') params: IDInput) {
    await this.problemService.removeProblem(params.id);

    return {
      message: 'Problem deleted successfully',
    };
  }
}
