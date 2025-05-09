import { Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Contest } from './entities/contest.entity';
import { PaginationInput } from 'src/common/dto/input.dto';

@Injectable()
export class ContestRepository extends Repository<Contest> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(Contest, entityManager);
  }

  findById(id: string, joins?: string[]): SelectQueryBuilder<Contest> {
    const query = this.createQueryBuilder('contest').where('contest.id = :id', {
      id,
    });

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`contest.${join}`, `${join}`));
    }

    return query;
  }

  async updateContestById(id: string, updateData: Partial<Contest>) {
    const result = await this.createQueryBuilder('contest').where('contest.id = :id', { id }).update(updateData).execute();

    if (result && result.affected && result.affected > 0) {
      return this.findOne({ where: { id } });
    }

    return null;
  }

  findUpcomingContests(pagination?: PaginationInput, order?: { by?: string; order?: 'ASC' | 'DESC' }) {
    const now = new Date();
    const query = this.createQueryBuilder('contest').where('contest.startTime > :now AND contest.isActive = true', { now });

    if (order) {
      query.orderBy(`contest.${order.by ?? 'createdAt'}`, order.order ?? 'ASC');
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }

  findOngoingContests(pagination?: PaginationInput, order?: { by?: string; order?: 'ASC' | 'DESC' }) {
    const now = new Date();
    const query = this.createQueryBuilder('contest').where('contest.startTime <= :now AND contest.endTime >= :now', { now });

    if (order) {
      query.orderBy(`contest.${order.by ?? 'createdAt'}`, order.order ?? 'ASC');
    }

    if (pagination) {
      query.skip((pagination.page - 1) * pagination.limit || 0).take(pagination.limit || 10);
    }

    return query;
  }
}
