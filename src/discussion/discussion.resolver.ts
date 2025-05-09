import { Resolver } from '@nestjs/graphql';
import { DiscussionService } from './discussion.service';
import { Discussion } from './entities/discussion.entity';

@Resolver(() => Discussion)
export class DiscussionResolver {
  constructor(private readonly discussionService: DiscussionService) {}
}
