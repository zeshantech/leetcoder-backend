import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Subscription {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
