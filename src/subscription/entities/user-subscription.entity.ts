import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SubscriptionPlan } from '../../common/types/common.types';
import { User } from '../../user/entities/user.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class UserSubscription extends EntityBase {
  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn()
  user: User;

  @Field()
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  plan: SubscriptionPlan;

  @Field(() => Date)
  @Column()
  startDate: Date;

  @Field(() => Date)
  @Column()
  endDate: Date;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  autoRenew: boolean;
}
