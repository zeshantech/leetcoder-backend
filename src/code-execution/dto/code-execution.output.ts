import { Field, ObjectType, ID } from '@nestjs/graphql';
import { SubmissionStatus } from '../../common/types/common.types';

@ObjectType()
export class CodeExecutionOutput {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message: string;

  @Field(() => ID)
  executionId: string;

  @Field()
  status: SubmissionStatus;
}

@ObjectType()
export class ExecutionResultOutput {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => ID)
  executionId: string;

  @Field()
  status: SubmissionStatus;

  @Field({ nullable: true })
  output?: string;

  @Field({ nullable: true })
  memory?: number;

  @Field({ nullable: true })
  runtime?: number;

  @Field({ nullable: true })
  testCasesPassed?: number;

  @Field({ nullable: true })
  totalTestCases?: number;

  @Field({ nullable: true })
  errorMessage?: string;
}
