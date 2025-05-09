import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ContestRegistration } from './entities/contest-registration.entity';
import { PaginationInput } from 'src/common/dto/input.dto';

@Injectable()
export class ContestRegistrationRepository extends Repository<ContestRegistration> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(ContestRegistration, entityManager);
  }

  findByContestIdAndUserId(contestId: string, userId: string): SelectQueryBuilder<ContestRegistration> {
    return this.createQueryBuilder('registration').where('registration.contest = :contestId AND registration.user = :userId', {
      contestId,
      userId,
    });
  }

  findByContestId(contestId: string, pagination: PaginationInput, order?: { by?: string; order?: 'ASC' | 'DESC' }, joins?: string[]): SelectQueryBuilder<ContestRegistration> {
    const query = this.createQueryBuilder('registration').where('registration.contest = :contestId', {
      contestId,
    });

    if (order?.by) {
      query.orderBy(`registration.${order?.by ?? 'createdAt'}`, order?.order ?? 'DESC');
    }

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`registration.${join}`, `${join}`));
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }

  async updateLeaderboard(contestId: string) {
    return this.createQueryBuilder()
      .update(ContestRegistration)
      .set({
        rank: () => `(
          SELECT r.rank 
          FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) as rank 
            FROM contest_registration 
            WHERE "contest" = :contestId
          ) r 
          WHERE r.id = contest_registration.id
        )`,
      })
      .where('contest = :contestId', { contestId })
      .execute();
  }

  findByUserId(userId: string, pagination: PaginationInput, order?: { by: string; order: 'ASC' | 'DESC' }, joins?: string[]): SelectQueryBuilder<ContestRegistration> {
    const query = this.createQueryBuilder('registration').where('registration.user = :userId', { userId });

    if (order?.by) {
      query.orderBy(`registration.${order?.by ?? 'createdAt'}`, order?.order ?? 'DESC');
    }

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`registration.${join}`, `${join}`));
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }
}
