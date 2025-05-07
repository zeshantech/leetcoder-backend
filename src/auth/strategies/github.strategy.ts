import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: `${configService.get<string>('APP_URL')}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    _: string,
    __: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    // GitHub might not provide email directly, might need to fetch it
    const email = profile.emails && profile.emails[0]?.value;
    const name = profile.displayName || profile.username;
    const [firstName, lastName] = name.split(' ');

    const user = await this.authService.findOrCreateOAuthUser({
      email: email,
      firstName: firstName || profile.username,
      lastName: lastName || '',
      picture: profile.photos[0]?.value,
      provider: 'github',
      providerId: profile.id,
    });

    done(null, user);
  }
}
