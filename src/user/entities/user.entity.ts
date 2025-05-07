import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { Submission } from '../../submission/entities/submission.entity';
import { Discussion } from '../../discussion/entities/discussion.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { UserSubscription } from '../../subscription/entities/user-subscription.entity';
import { ContestRegistration } from '../../contest/entities/contest-registration.entity';
import { Problem } from '../../problem/entities/problem.entity';
import { EntityBase } from 'src/common/entities/base.entity';
import { UserRole } from 'src/common/types/common.types';

@ObjectType()
@Entity()
export class User extends EntityBase {
  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field(() => Number)
  @Column({ default: 0 })
  reputation: number;

  @Field(() => Number)
  @Column({ default: 0 })
  totalSolved: number;

  @Field(() => Number)
  @Column({ default: 0 })
  easyProblemsSolved: number;

  @Field(() => Number)
  @Column({ default: 0 })
  mediumProblemsSolved: number;

  @Field(() => Number)
  @Column({ default: 0 })
  hardProblemsSolved: number;

  @Field(() => Number)
  @Column({ default: 0 })
  currentStreak: number;

  @Field(() => Number)
  @Column({ default: 0 })
  maxStreak: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isVerified: boolean;

  @Field(() => [Submission], { nullable: true })
  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @Field(() => [Discussion], { nullable: true })
  @OneToMany(() => Discussion, (discussion) => discussion.user)
  discussions: Discussion[];

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Field(() => UserSubscription, { nullable: true })
  @OneToMany(() => UserSubscription, (subscription) => subscription.user)
  subscriptions: UserSubscription[];

  @Field(() => [ContestRegistration], { nullable: true })
  @OneToMany(() => ContestRegistration, (registration) => registration.user)
  contestRegistrations: ContestRegistration[];

  @Field(() => [Problem], { nullable: true })
  @OneToMany(() => Problem, (problem) => problem.user)
  problems: Problem[];
}
