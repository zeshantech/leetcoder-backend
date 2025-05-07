import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Problem } from '../../problem/entities/problem.entity';
import { Comment } from './comment.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class Discussion extends EntityBase {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.discussions)
  @JoinColumn()
  user: User;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  problemId?: string;

  @Field(() => Problem, { nullable: true })
  @ManyToOne(() => Problem, { nullable: true })
  @JoinColumn()
  problem?: Problem;

  @Field(() => Number)
  @Column({ default: 0 })
  upvotes: number;

  @Field(() => Number)
  @Column({ default: 0 })
  downvotes: number;

  @Field(() => Number)
  @Column({ default: 0 })
  views: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isPinned: boolean;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.discussion)
  comments?: Comment[];
}
