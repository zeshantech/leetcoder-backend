import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { Difficulty, TestCaseIOType } from '../../common/types/common.types';
import { Submission } from '../../submission/entities/submission.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity('problems')
export class Problem extends EntityBase {
  @Field()
  title: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'enum', enum: Difficulty })
  @Field()
  difficulty: Difficulty;

  @Column({ type: 'simple-array' })
  @Field(() => [String])
  tags: string[];

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  constraints: string;

  @Column({ default: 0, type: 'int' })
  @Field()
  submissionCount: number;

  @Column({ default: 0 })
  @Field()
  acceptedCount: number;

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
  acceptanceRate: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  solutionLink: string;

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
  testCases: ProblemTestCase[];

  @Field(() => [Submission], { nullable: true })
  @OneToMany(() => Submission, (submission) => submission.problem)
  problemSubmissions: Submission[];
}

@ObjectType()
@Entity()
export class ProblemTestCase extends EntityBase {
  @Field()
  @Column({ type: 'text' })
  input: string;

  @Field()
  @Column({ type: 'text' })
  output: string;

  @Field()
  @Column({ type: 'enum', enum: TestCaseIOType, default: TestCaseIOType.STRING })
  inputType: TestCaseIOType;

  @Field()
  @Column({ type: 'enum', enum: TestCaseIOType, default: TestCaseIOType.STRING })
  outputType: TestCaseIOType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  explanation: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isHidden: boolean;

  @Field(() => Problem)
  @ManyToOne(() => Problem, (problem) => problem.testCases)
  problem: Problem;
}

@ObjectType()
@Entity()
export class ProblemList extends EntityBase {
  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublic: boolean;

  @ManyToMany(() => Problem)
  @JoinTable({ name: 'problem_list_problem' })
  @Field(() => [Problem])
  problems: Problem[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.problemLists)
  @JoinColumn()
  user: User;
}
