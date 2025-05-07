import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Difficulty } from '../../common/types/common.types';
import { Submission } from '../../submission/entities/submission.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class Problem extends EntityBase {
  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => Difficulty)
  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.MEDIUM,
  })
  difficulty: Difficulty;

  @Field(() => [String])
  @Column('simple-array')
  tags: string[];

  @Field()
  @Column('text')
  constraints: string;

  @Field()
  @Column('text')
  examples: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  hints?: string;

  @Field(() => Number)
  @Column({ default: 0 })
  likes: number;

  @Field(() => Number)
  @Column({ default: 0 })
  dislikes: number;

  @Field(() => Number)
  @Column({ default: 0 })
  submissions: number;

  @Field(() => Number)
  @Column({ default: 0 })
  acceptedSubmissions: number;

  @Field(() => Number, { nullable: true })
  acceptanceRate?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  solutionLink?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isPremium: boolean;

  @Field(() => Number)
  @Column({ default: 0 })
  timeLimit: number;

  @Field(() => Number)
  @Column({ default: 0 })
  memoryLimit: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.problems)
  @JoinColumn()
  user: User;

  @Field(() => [ProblemTestCase], { nullable: true })
  @OneToMany(() => ProblemTestCase, (testCase) => testCase.problem)
  testCases?: ProblemTestCase[];

  @Field(() => [Submission], { nullable: true })
  @OneToMany(() => Submission, (submission) => submission.problem)
  problemSubmissions?: Submission[];
}

@ObjectType()
@Entity()
export class ProblemTestCase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  input: string;

  @Field()
  @Column()
  output: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  explanation?: string;

  @Field(() => Problem)
  @ManyToMany(() => Problem, (problem) => problem.testCases)
  problem: Problem;
}

@ObjectType()
@Entity()
export class ProblemList {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublic: boolean;

  @ManyToMany(() => Problem)
  @JoinTable()
  @Field(() => [Problem])
  problems: Problem[];

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
