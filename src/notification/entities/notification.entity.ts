import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class Notification extends EntityBase {
  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn()
  user: User;

  @Field(() => ID)
  @Column()
  title: string;

  @Field(() => ID)
  @Column('text')
  message: string;

  @Field(() => ID)
  @Column({ default: false })
  isRead: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityType?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityId?: string;
}

@ObjectType()
@Entity()
export class NotificationSettings extends EntityBase {
  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => ID)
  @Column({ default: true })
  emailNotifications: boolean;

  @Field(() => ID)
  @Column({ default: true })
  contestNotifications: boolean;

  @Field(() => ID)
  @Column({ default: true })
  discussionNotifications: boolean;

  @Field(() => ID)
  @Column({ default: true })
  achievementNotifications: boolean;
}
