import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  displayName: string;

  @Field(() => String, { nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string;
}

@InputType()
export class UpdateUserPasswordInput {
  @Field(() => String)
  oldPassword: string;

  @Field(() => String)
  newPassword: string;
}

export interface ICreateUserInput {
  username: string;
  email: string;
  password?: string;
  displayName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  password?: string;
  isVerified?: boolean;
}
