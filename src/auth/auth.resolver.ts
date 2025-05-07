import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  ResendVerificationEmailInput,
} from './dto/auth.input';
import { MessageOutput } from 'src/common/dto/output.dto';
import { AuthOutput } from './dto/auth.output';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => MessageOutput)
  async register(@Args('input') registerInput: RegisterInput) {
    await this.authService.register(registerInput);
    return { message: 'Check your mailbox to verify email' };
  }

  @Mutation(() => AuthOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthOutput> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => MessageOutput)
  async verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput) {
    await this.authService.verifyEmail(verifyEmailInput.token);
    return {
      message: 'Email verified successfully',
    };
  }

  @Mutation(() => MessageOutput)
  async resendVerificationEmail(
    @Args('input') input: ResendVerificationEmailInput,
  ) {
    await this.authService.resendVerificationEmail(input.email);
    return {
      message: 'Verification email sent successfully',
    };
  }

  @Mutation(() => MessageOutput)
  async requestPasswordReset(@Args('input') input: RequestPasswordResetInput) {
    await this.authService.requestPasswordReset(input.email);
    return {
      message:
        'If your email is registered, you will receive a password reset link',
    };
  }

  @Mutation(() => MessageOutput)
  async resetPassword(@Args('input') input: ResetPasswordInput) {
    await this.authService.resetPassword(input);
    return {
      message: 'Password reset successfully',
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageOutput)
  async logout(@CurrentUser() user: CurrentUser) {
    await this.authService.logout(user);
    return {
      message: 'Logged out successfully',
    };
  }
}
