import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { EmailService } from './email.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    TokenService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    EmailService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
