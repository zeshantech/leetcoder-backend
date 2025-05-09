import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  page: number;

  @Field(() => Number, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  limit: number;
}

@InputType()
export class IDInput {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
