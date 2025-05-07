import { CreateContestInput } from './create-contest.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateContestInput extends PartialType(CreateContestInput) {
  @Field(() => Int)
  id: number;
}
