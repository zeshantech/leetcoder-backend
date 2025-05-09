import { Injectable } from '@nestjs/common';
import { ProblemList } from './entities/problem.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class ProblemListRepository extends Repository<ProblemList> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(ProblemList, entityManager);
  }

  findByIdAndUser(listId: string, userId: string, joins?: string[]): SelectQueryBuilder<ProblemList> {
    const query = this.createQueryBuilder('list').where('list.id = :listId AND list.user = :userId', {
      listId,
      userId,
    });

    if (joins) {
      joins.forEach((join) => query.leftJoinAndSelect(`list.${join}`, `${join}`));
    }

    return query;
  }

  async deleteByIdAndUser(listId: string, userId: string) {
    return this.createQueryBuilder('list')
      .where('list.id = :listId AND list.user = :userId', {
        listId,
        userId,
      })
      .delete()
      .execute();
  }

  async updateByIdAndUser(listId: string, userId: string, updateData: Partial<ProblemList>) {
    return this.createQueryBuilder('list')
      .where('list.id = :listId AND list.user = :userId', {
        listId,
        userId,
      })
      .update(updateData)
      .execute();
  }
}
