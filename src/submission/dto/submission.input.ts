import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt } from 'class-validator';
import { PaginationInput } from 'src/common/dto/input.dto';

@InputType()
export class CreateSubmissionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  language: string;

  @Field(() => ID)
  @IsUUID()
  problemId: string;
}

@InputType()
export class UpdateSubmissionInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  code: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  language: string;
}

@InputType()
export class GetSubmissionsInput extends PaginationInput {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  problemId: string;
}
