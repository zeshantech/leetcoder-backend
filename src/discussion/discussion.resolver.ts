import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DiscussionService } from './discussion.service';
import { Discussion } from './entities/discussion.entity';
import { CreateDiscussionInput } from './dto/create-discussion.input';
import { UpdateDiscussionInput } from './dto/update-discussion.input';

@Resolver(() => Discussion)
export class DiscussionResolver {
  constructor(private readonly discussionService: DiscussionService) {}

  @Mutation(() => Discussion)
  createDiscussion(@Args('createDiscussionInput') createDiscussionInput: CreateDiscussionInput) {
    return this.discussionService.create(createDiscussionInput);
  }

  @Query(() => [Discussion], { name: 'discussion' })
  findAll() {
    return this.discussionService.findAll();
  }

  @Query(() => Discussion, { name: 'discussion' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.discussionService.findOne(id);
  }

  @Mutation(() => Discussion)
  updateDiscussion(@Args('updateDiscussionInput') updateDiscussionInput: UpdateDiscussionInput) {
    return this.discussionService.update(updateDiscussionInput.id, updateDiscussionInput);
  }

  @Mutation(() => Discussion)
  removeDiscussion(@Args('id', { type: () => Int }) id: number) {
    return this.discussionService.remove(id);
  }
}
