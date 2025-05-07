import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Contest } from './contest.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class ContestRegistration extends EntityBase {
  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.contestRegistrations)
  @JoinColumn()
  user: User;

  @Field(() => ID)
  @Column()
  contestId: string;

  @Field(() => Contest)
  @ManyToOne(() => Contest, (contest) => contest.registrations)
  @JoinColumn()
  contest: Contest;

  @Field(() => Number)
  @Column({ default: 0 })
  score: number;

  @Field(() => Number)
  @Column({ default: 0 })
  rank: number;
}
