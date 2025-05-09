import { Field, InputType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInput } from 'src/common/dto/input.dto';

@InputType()
export class CreateContestInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isPremium: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  problemIds: string[];
}

@InputType()
export class UpdateContestInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endTime: Date;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPremium: boolean;
}

@InputType()
export class GetContestsInput extends PaginationInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPremium: boolean;
}

@InputType()
export class RegisterForContestInput {
  @Field(() => ID)
  @IsUUID()
  contestId: string;
}

@InputType()
export class AddProblemToContestInput {
  @Field(() => ID)
  @IsUUID()
  contestId: string;

  @Field(() => ID)
  @IsUUID()
  problemId: string;
}

@InputType()
export class RemoveProblemFromContestInput {
  @Field(() => ID)
  @IsUUID()
  contestId: string;

  @Field(() => ID)
  @IsUUID()
  problemId: string;
}

@InputType()
export class GetContestLeaderboardInput {
  @Field(() => ID)
  @IsUUID()
  contestId: string;

  @Field(() => Number, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  page: number;

  @Field(() => Number, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  limit: number;
}
