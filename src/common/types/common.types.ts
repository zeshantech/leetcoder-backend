import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum ProblemStatus {
  SOLVED = 'SOLVED',
  ATTEMPTED = 'ATTEMPTED',
  NOT_STARTED = 'NOT_STARTED',
}

export enum SubmissionStatus {
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  PENDING = 'PENDING',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum ContestStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

registerEnumType(Difficulty, {
  name: 'Difficulty',
});

registerEnumType(ProblemStatus, {
  name: 'ProblemStatus',
});

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});

registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
});

registerEnumType(ContestStatus, {
  name: 'ContestStatus',
});

@ObjectType()
export class PaginationInfo {
  @Field()
  totalCount: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}

@ObjectType()
export class BaseResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
