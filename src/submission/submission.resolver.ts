import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionInput, GetSubmissionsInput } from './dto/submission.input';
import { GetSubmissionsOutput } from './dto/submission.output';
import { IDInput } from 'src/common/dto/input.dto';

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly submissionService: SubmissionService) {}

  @Mutation(() => Submission)
  @UseGuards(AuthGuard)
  async submitSolution(@Args('input') input: CreateSubmissionInput, @CurrentUser() user: CurrentUser) {
    return this.submissionService.submit(input, user);
  }

  @Query(() => GetSubmissionsOutput)
  @UseGuards(AuthGuard)
  async getAllSubmissions(@CurrentUser() user: CurrentUser, @Args('input', { nullable: true }) input: GetSubmissionsInput) {
    return this.submissionService.getAllSubmissions(input, user);
  }

  @Query(() => Submission)
  @UseGuards(AuthGuard)
  async submission(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    return this.submissionService.getSubmission(params.id, user);
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  async submissionStatus(@Args('params') params: IDInput, @CurrentUser() user: CurrentUser) {
    return this.submissionService.checkStatus(params.id, user);
  }

  @Query(() => GetSubmissionsOutput)
  @UseGuards(AuthGuard)
  async problemSubmissions(@Args('params') params: IDInput, @Args('input', { nullable: true }) input: GetSubmissionsInput) {
    return this.submissionService.getSubmissionsByProblemId(params.id, input);
  }
}
