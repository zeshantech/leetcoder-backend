import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CodeExecutionService } from './code-execution.service';
import { ExecuteCodeInput } from './dto/code-execution.input';
import { CodeExecutionOutput, ExecutionResultOutput } from './dto/code-execution.output';
import { IDInput } from 'src/common/dto/input.dto';

@Resolver()
export class CodeExecutionResolver {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Mutation(() => CodeExecutionOutput)
  @UseGuards(AuthGuard)
  async executeCode(@Args('input') input: ExecuteCodeInput, @CurrentUser() user: any): Promise<CodeExecutionOutput> {
    return this.codeExecutionService.executeCode(input, user.id);
  }

  @Query(() => ExecutionResultOutput)
  @UseGuards(AuthGuard)
  async executionResult(@Args('params') params: IDInput, @CurrentUser() user: any): Promise<ExecutionResultOutput> {
    return this.codeExecutionService.getExecutionResult(params.id, user.id);
  }
}
