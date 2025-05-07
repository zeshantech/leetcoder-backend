import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProblemModule } from './problem/problem.module';
import { SubmissionModule } from './submission/submission.module';
import { ContestModule } from './contest/contest.module';
import { DiscussionModule } from './discussion/discussion.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NotificationModule } from './notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import {
  Problem,
  ProblemTestCase,
  ProblemList,
} from './problem/entities/problem.entity';
import { Submission } from './submission/entities/submission.entity';
import { Contest } from './contest/entities/contest.entity';
import { ContestRegistration } from './contest/entities/contest-registration.entity';
import { Discussion } from './discussion/entities/discussion.entity';
import { Comment } from './discussion/entities/comment.entity';
import { UserSubscription } from './subscription/entities/user-subscription.entity';
import {
  Notification,
  NotificationSettings,
} from './notification/entities/notification.entity';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { SharedModule } from './shared/shared.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Cache
    CacheModule.register(),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure:
            configService.get<string>('EMAIL_SECURE') === 'true' ? true : false,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || 'root',
        database: configService.get<string>('DB_DATABASE') || 'leetcode',
        entities: [
          User,
          Problem,
          ProblemTestCase,
          ProblemList,
          Submission,
          Contest,
          ContestRegistration,
          Discussion,
          Comment,
          UserSubscription,
          Notification,
          NotificationSettings,
        ],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
      graphiql: true,
    }),

    // Redis
    SharedModule,

    // Feature modules
    AuthModule,
    UserModule,
    ProblemModule,
    SubmissionModule,
    ContestModule,
    DiscussionModule,
    SubscriptionModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
