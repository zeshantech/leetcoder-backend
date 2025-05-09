import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ContestStatus } from '../../common/types/common.types';
import { Problem } from '../../problem/entities/problem.entity';
import { ContestRegistration } from './contest-registration.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class Contest extends EntityBase {
  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => Date)
  @Column()
  startTime: Date;

  @Field(() => Date)
  @Column()
  endTime: Date;

  @Field()
  @Column({
    type: 'enum',
    enum: ContestStatus,
    default: ContestStatus.UPCOMING,
  })
  status: ContestStatus;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isPremium: boolean;

  @Field(() => Number)
  @Column({ default: 0 })
  registeredParticipants: number;

  @Field(() => [Problem])
  @ManyToMany(() => Problem)
  @JoinTable({ name: 'contest_problem' })
  problems: Problem[];

  @Field(() => [ContestRegistration], { nullable: true })
  @OneToMany(() => ContestRegistration, (registration) => registration.contest)
  registrations: ContestRegistration[];
}
