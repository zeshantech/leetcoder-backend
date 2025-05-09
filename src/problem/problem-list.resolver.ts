import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProblemListService } from './problem-list.service';
import { ProblemList } from './entities/problem.entity';
import { CreateProblemListInput, UpdateProblemListInput, GetProblemListsInput, AddProblemToListInput, RemoveProblemFromListInput } from './dto/problem.input';
import { MessageOutput } from 'src/common/dto/output.dto';
import { GetAllProblemListsOutput } from './dto/problem.output';
import { IDInput } from 'src/common/dto/input.dto';

@Resolver(() => ProblemList)
export class ProblemListResolver {
  constructor(private readonly problemListService: ProblemListService) {}

  @Query(() => GetAllProblemListsOutput)
  @UseGuards(AuthGuard)
  async getAllProblemLists(@CurrentUser() user: CurrentUser, @Args('input', { nullable: true }) input: GetProblemListsInput) {
    return this.problemListService.getAllProblemLists(input, user);
  }

  @Query(() => ProblemList)
  @UseGuards(AuthGuard)
  async getProblemList(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    return this.problemListService.getOneProblemList(params.id, user);
  }

  @Mutation(() => ProblemList)
  @UseGuards(AuthGuard)
  async createProblemList(@Args('input') input: CreateProblemListInput, @CurrentUser() user: CurrentUser) {
    return this.problemListService.createProblemList(input, user);
  }

  @Mutation(() => ProblemList)
  @UseGuards(AuthGuard)
  async updateProblemList(@Args('input') input: UpdateProblemListInput, @CurrentUser() user: CurrentUser) {
    return this.problemListService.updateProblemList(input, user);
  }

  @Mutation(() => MessageOutput)
  @UseGuards(AuthGuard)
  async deleteProblemList(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    await this.problemListService.removeProblemList(params.id, user);
    return {
      message: 'Problem list deleted successfully',
    };
  }

  @Mutation(() => ProblemList)
  @UseGuards(AuthGuard)
  async addProblemToList(@Args('input') input: AddProblemToListInput, @CurrentUser() user: CurrentUser) {
    return this.problemListService.addProblemToList(input, user);
  }

  @Mutation(() => ProblemList)
  @UseGuards(AuthGuard)
  async removeProblemFromList(@Args('input') input: RemoveProblemFromListInput, @CurrentUser() user: CurrentUser) {
    return this.problemListService.removeProblemFromList(input, user);
  }
}
