import { Repository, SelectQueryBuilder } from 'typeorm';

import { InjectEntityManager } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationInput } from 'src/common/dto/input.dto';

@Injectable()
export class SubmissionRepository extends Repository<Submission> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(Submission, entityManager);
  }

  findByUserId(userId: string, pagination: PaginationInput, joins?: string[]) {
    const query = this.createQueryBuilder('submission').where('submission.user = :userId', { userId });

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`submission.${join}`, `${join}`));
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }

  findByProblemId(problemId: string, pagination: PaginationInput, joins?: string[]) {
    const query = this.createQueryBuilder('submission').where('submission.problem = :problemId', { problemId });

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`submission.${join}`, `${join}`));
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }

  findByIdAndUser(submissionId: string, userId: string, joins?: string[]): SelectQueryBuilder<Submission> {
    const query = this.createQueryBuilder('submission').where('submission.id = :submissionId AND submission.user = :userId', {
      submissionId,
      userId,
    });

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`submission.${join}`, `${join}`));
    }

    return query;
  }
}
