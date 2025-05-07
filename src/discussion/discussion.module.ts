import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionResolver } from './discussion.resolver';

@Module({
  providers: [DiscussionResolver, DiscussionService],
})
export class DiscussionModule {}
