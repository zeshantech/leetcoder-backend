import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    const tokens = await this.tokenService.authTokens(user.id, user.role);

    return res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    const tokens = await this.tokenService.authTokens(user.id, user.role);

    return res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }
}
