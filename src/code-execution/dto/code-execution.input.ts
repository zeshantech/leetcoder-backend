import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class ExecuteCodeInput {
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

  @Field(() => [String], { nullable: true })
  @IsOptional()
  customInputs?: string[];
}
