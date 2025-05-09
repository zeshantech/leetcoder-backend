import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProblemList, Problem } from './entities/problem.entity';
import { CreateProblemListInput, UpdateProblemListInput, GetProblemListsInput, AddProblemToListInput, RemoveProblemFromListInput } from './dto/problem.input';
import { ProblemListRepository } from './problem-list.repository';

@Injectable()
export class ProblemListService {
  constructor(
    private readonly problemListRepository: ProblemListRepository,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async createProblemList(input: CreateProblemListInput, user: CurrentUser) {
    const { problemIds, ...listData } = input;

    const list = this.problemListRepository.create({
      ...listData,
      user: { id: user.id },
    });

    if (problemIds && problemIds.length > 0) {
      const problems = await this.problemRepository.find({
        where: { id: In(problemIds) },
      });
      list.problems = problems;
    }

    const savedList = await this.problemListRepository.save(list);

    return savedList;
  }

  async getAllProblemLists(input: GetProblemListsInput, user: CurrentUser) {
    const { page = 1, limit = 10, isPublic } = input || {};
    const skip = (page - 1) * limit;

    const query = this.problemListRepository.createQueryBuilder('list').leftJoinAndSelect('list.problems', 'problems');

    if (isPublic !== undefined) {
      query.andWhere('list.isPublic = :isPublic', { isPublic });
    } else {
      query.andWhere('(list.user = :userId OR list.isPublic = true)', {
        userId: user.id,
      });
    }

    const totalCount = await query.getCount();

    const lists = await query.skip(skip).take(limit).getMany();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: lists,
    };
  }

  async getOneProblemList(id: string, user: CurrentUser) {
    const list = await this.problemListRepository.findOne({
      where: [
        { id, user: { id: user.id } },
        { id, isPublic: true },
      ],
      relations: ['problems'],
    });

    if (!list) {
      return {
        success: false,
        message: 'Problem list not found or not accessible',
      };
    }

    return list;
  }

  async updateProblemList(input: UpdateProblemListInput, user: CurrentUser) {
    const { id, ...updateData } = input;

    const updatedList = await this.problemListRepository.updateByIdAndUser(id, user.id, updateData);
    if (updatedList.affected === 0) {
      throw new NotFoundException('Problem list not found or you do not have permission to update it');
    }

    if (!updatedList) {
      throw new NotFoundException('Problem list was updated but could not be retrieved');
    }

    return updatedList;
  }

  async removeProblemList(id: string, user: CurrentUser) {
    const problem = await this.problemListRepository.deleteByIdAndUser(id, user.id);

    if (problem.affected === 0) {
      throw new NotFoundException('Problem list not found or you do not have permission to delete it');
    }
  }

  async addProblemToList(input: AddProblemToListInput, user: CurrentUser) {
    const { listId, problemId } = input;

    const list = await this.problemListRepository.findByIdAndUser(listId, user.id, ['problems']).getOne();

    if (!list) {
      throw new NotFoundException('Problem list not found or you do not have permission to update it');
    }

    const problem = await this.problemRepository.findOne({
      where: { id: problemId },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    if (!list.problems) {
      list.problems = [];
    }

    // Check if problem is already in the list
    const problemExists = list.problems.some((p) => p.id === problemId);

    if (!problemExists) {
      list.problems.push(problem);
      await this.problemListRepository.save(list);
    }

    return list;
  }

  async removeProblemFromList(input: RemoveProblemFromListInput, user: CurrentUser) {
    const { listId, problemId } = input;

    const list = await this.problemListRepository.findByIdAndUser(listId, user.id, ['problems']).getOne();

    if (!list) {
      throw new NotFoundException('Problem list not found or you do not have permission to update it');
    }

    if (!list.problems) {
      throw new NotFoundException('List already does not contain this problem');
    }

    list.problems = list.problems.filter((p) => p.id !== problemId);
    await this.problemListRepository.save(list);

    return list;
  }
}
