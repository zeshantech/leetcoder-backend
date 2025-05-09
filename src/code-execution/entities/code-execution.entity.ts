import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SubmissionStatus } from '../../common/types/common.types';
import { User } from '../../user/entities/user.entity';
import { Problem } from '../../problem/entities/problem.entity';

@ObjectType()
@Entity('code_executions')
export class CodeExecution {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => ID)
  @Column()
  problemId: string;

  @Field(() => Problem)
  @ManyToOne(() => Problem)
  @JoinColumn()
  problem: Problem;

  @Field()
  @Column('text')
  code: string;

  @Field()
  @Column()
  language: string;

  @Field()
  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  output?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  memory?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  runtime?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  testCasesPassed?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  totalTestCases?: number;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  errorMessage?: string;

  @Field(() => Date)
  @CreateDateColumn()
  executedAt: Date;
}
