import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubmissionStatus } from '../../common/types/common.types';
import { User } from '../../user/entities/user.entity';
import { Problem } from '../../problem/entities/problem.entity';

@ObjectType()
@Entity()
export class Submission {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn()
  user: User;

  @Field(() => ID)
  @Column()
  problemId: string;

  @Field(() => Problem)
  @ManyToOne(() => Problem, (problem) => problem.problemSubmissions)
  @JoinColumn()
  problem: Problem;

  @Field()
  @Column('text')
  code: string;

  @Field()
  @Column()
  language: string;

  @Field(() => SubmissionStatus)
  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  runtime?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  memory?: number;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  errorMessage?: string;

  @Field(() => Date)
  @CreateDateColumn()
  submittedAt: Date;
}
