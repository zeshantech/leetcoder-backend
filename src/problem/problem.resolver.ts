import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProblemService } from './problem.service';
import { Problem } from './entities/problem.entity';
import { CreateProblemInput } from './dto/create-problem.input';
import { UpdateProblemInput } from './dto/update-problem.input';

@Resolver(() => Problem)
export class ProblemResolver {
  constructor(private readonly problemService: ProblemService) {}

  @Mutation(() => Problem)
  createProblem(@Args('createProblemInput') createProblemInput: CreateProblemInput) {
    return this.problemService.create(createProblemInput);
  }

  @Query(() => [Problem], { name: 'problem' })
  findAll() {
    return this.problemService.findAll();
  }

  @Query(() => Problem, { name: 'problem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.problemService.findOne(id);
  }

  @Mutation(() => Problem)
  updateProblem(@Args('updateProblemInput') updateProblemInput: UpdateProblemInput) {
    return this.problemService.update(updateProblemInput.id, updateProblemInput);
  }

  @Mutation(() => Problem)
  removeProblem(@Args('id', { type: () => Int }) id: number) {
    return this.problemService.remove(id);
  }
}
