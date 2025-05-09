import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class MessageOutput {
  @Field(() => String)
  message: string;
}

export function PaginatedOutput<TItem extends object>(TItemClass: TItem) {
  @ObjectType()
  abstract class PaginatedOutputClass {
    @Field()
    totalCount: number;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;

    @Field()
    currentPage: number;

    @Field()
    totalPages: number;

    @Field(() => [TItemClass])
    docs: TItem[];
  }

  return PaginatedOutputClass;
}
