import { Field, InputType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Difficulty, TestCaseIOType } from '../../common/types/common.types';
import { PaginationInput } from 'src/common/dto/input.dto';
import { Type } from 'class-transformer';

@InputType()
export class TestCaseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  input: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  output: string;

  @Field()
  @IsEnum(TestCaseIOType)
  @IsNotEmpty()
  inputType: TestCaseIOType;

  @Field()
  @IsEnum(TestCaseIOType)
  @IsNotEmpty()
  outputType: TestCaseIOType;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  explanation: string;
}

@InputType()
export class CreateProblemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @Field(() => [String])
  @IsArray()
  tags: string[];

  @Field(() => [TestCaseInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseInput)
  testCases: TestCaseInput[];

  @Field()
  @IsString()
  constraints: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  solutionLink: string;

  @Field({ defaultValue: true })
  @IsOptional()
  isActive: boolean;

  @Field({ defaultValue: false })
  @IsOptional()
  isPremium: boolean;

  @Field(() => Number)
  @IsNumber()
  timeLimit: number;

  @Field(() => Number)
  @IsNumber()
  memoryLimit: number;
}

@InputType()
export class UpdateProblemInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => String, { nullable: true })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty: Difficulty;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @Field(() => [TestCaseInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseInput)
  @IsOptional()
  testCases: TestCaseInput[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  constraints: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  solutionLink: string;

  @Field({ nullable: true })
  @IsOptional()
  isActive: boolean;

  @Field({ nullable: true })
  @IsOptional()
  isPremium: boolean;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  timeLimit: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  memoryLimit: number;
}

@InputType()
export class GetProblemsInput extends PaginationInput {
  @Field(() => String, { nullable: true })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty: Difficulty;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search: string;
}

@InputType()
export class CreateProblemListInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  problemIds: string[];
}

@InputType()
export class UpdateProblemListInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
}

@InputType()
export class GetProblemListsInput extends PaginationInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
}

@InputType()
export class AddProblemToListInput {
  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  problemId: string;
}

@InputType()
export class RemoveProblemFromListInput {
  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  problemId: string;
}
