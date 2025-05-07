import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDiscussionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
