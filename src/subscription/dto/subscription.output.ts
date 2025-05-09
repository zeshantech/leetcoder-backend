import { CreateSubscriptionInput } from './subscription.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionInput extends PartialType(CreateSubscriptionInput) {
  @Field(() => Int)
  id: number;
}
