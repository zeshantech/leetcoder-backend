import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../shared/redis.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenService {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async authTokens(userId: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: '1d' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: '15d' },
    );

    await this.redisService.set(
      `auth:${userId}`,
      refreshToken,
      60 * 60 * 24 * 15,
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);
    const user = await this.userService.findOneUser({ id: decoded.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.redisService.get(`auth:${user.id}`);
    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.authTokens(user.id, user.role);
  }

  async verificationToken(email: string) {
    const token = this.jwtService.sign({ email }, { expiresIn: '1d' });
    await this.redisService.set(`verification:${email}`, token, 60 * 60 * 24);

    return token;
  }

  async verifyVerificationToken(token: string) {
    const decoded = this.jwtService.verify(token);
    if (!decoded.email) {
      throw new UnauthorizedException('Invalid verification token');
    }

    const storedToken = await this.redisService.get(
      `verification:${decoded.email}`,
    );

    if (storedToken !== token) {
      throw new UnauthorizedException('Invalid verification token');
    }

    await this.redisService.del(`verification:${token}`);

    return decoded.email;
  }
}
