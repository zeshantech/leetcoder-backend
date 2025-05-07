import { CreateDiscussionInput } from './create-discussion.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiscussionInput extends PartialType(CreateDiscussionInput) {
  @Field(() => Int)
  id: number;
}
