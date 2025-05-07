import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from './dto/auth.input';
import { EmailService } from './email.service';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt';
import { UserService } from 'src/user/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  async register(input: RegisterInput) {
    const existingUser = await this.userService.findOneUser([
      { username: input.username },
      { email: input.email },
    ]);

    if (existingUser) {
      if (existingUser.username === input.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === input.email) {
        throw new ConflictException('Email already exists');
      }
    }

    const user = await this.userService.createUser({
      username: input.username,
      email: input.email,
      password: await hashPassword(input.password),
    });

    await this.sendVerificationEmail(user);
  }

  async login(input: LoginInput) {
    const user = await this.userService.findOneUser([
      { username: input.identifier },
      { email: input.identifier },
    ]);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password not created');
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email to login.',
      );
    }

    return {
      ...(await this.tokenService.authTokens(user.id, user.role)),
      user,
    };
  }

  async findOrCreateOAuthUser(input: {
    email: string;
    provider: string;
    providerId: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }): Promise<User> {
    let user = await this.userService.findOneUser({ email: input.email });

    if (user) {
      return user;
    }

    const username = `${input.email.split('@')[0]}_${input.providerId}`;
    const displayName =
      input.firstName && input.lastName
        ? `${input.firstName} ${input.lastName}`
        : input.email.split('@')[0];

    return this.userService.createUser({
      username,
      email: input.email,
      displayName,
      avatarUrl: input.picture,
      isVerified: true,
    });
  }

  async verifyEmail(token: string) {
    const email = await this.tokenService.verifyVerificationToken(token);
    if (!email) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.userService.updateUser({ email }, { isVerified: true });
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userService.findOneUser({ email });

    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified)
      throw new BadRequestException('Email already verified');

    await this.sendVerificationEmail(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findOneUser({ email });

    if (!user) {
      // For security reasons, don't reveal if email exists
      return true;
    }

    const token = await this.tokenService.verificationToken(user.email);
    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(resetInput: ResetPasswordInput) {
    const { token, newPassword } = resetInput;

    const email = await this.tokenService.verifyVerificationToken(token);
    if (!email) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.userService.updateUser(
      { email },
      {
        password: await hashPassword(newPassword),
      },
    );
  }

  async logout(_: CurrentUser) {
    // will revoke access and refresh tokens

    return true;
  }

  private async sendVerificationEmail(user: User) {
    const token = await this.tokenService.verificationToken(user.email);

    await this.emailService.sendVerificationEmail(user.email, token);
  }
}
