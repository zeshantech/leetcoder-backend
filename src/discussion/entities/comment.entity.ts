import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Discussion } from './discussion.entity';
import { EntityBase } from 'src/common/entities/base.entity';

@ObjectType()
@Entity()
export class Comment extends EntityBase {
  @Field()
  @Column('text')
  content: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => ID)
  @Column()
  discussionId: string;

  @Field(() => Discussion)
  @ManyToOne(() => Discussion, (discussion) => discussion.comments)
  @JoinColumn({ name: 'discussionId' })
  discussion: Discussion;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  parentId?: string;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Comment;

  @Field(() => Number)
  @Column({ default: 0 })
  upvotes: number;

  @Field(() => Number)
  @Column({ default: 0 })
  downvotes: number;
}
