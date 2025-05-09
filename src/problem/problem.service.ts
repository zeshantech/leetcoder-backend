import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Problem, ProblemTestCase } from './entities/problem.entity';
import { CreateProblemInput, GetProblemsInput, UpdateProblemInput } from './dto/problem.input';
import { Difficulty } from '../common/types/common.types';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(ProblemTestCase)
    private readonly testCaseRepository: Repository<ProblemTestCase>,
  ) {}

  async createProblem(input: CreateProblemInput, user: CurrentUser) {
    const { testCases, ...problemData } = input;

    const problem = this.problemRepository.create({
      ...problemData,
      user: { id: user.id },
    });

    const savedProblem = await this.problemRepository.save(problem);

    if (testCases.length) {
      const testCaseEntities = testCases.map((testCase) => ({
        ...testCase,
        problem: savedProblem,
      }));

      await this.testCaseRepository.insert(testCaseEntities);
    }

    return savedProblem;
  }

  async getAllProblems(input: GetProblemsInput) {
    const { page = 1, limit = 10, difficulty, tags, search } = input || {};
    const skip = (page - 1) * limit;

    const query = this.problemRepository.createQueryBuilder('problem');

    if (difficulty) {
      query.andWhere('problem.difficulty = :difficulty', { difficulty });
    }

    if (tags && tags.length > 0) {
      // This works for postgres array contains operator
      tags.forEach((tag, index) => {
        query.andWhere(`problem.tags LIKE :tag${index}`, {
          [`tag${index}`]: `%${tag}%`,
        });
      });
    }

    if (search) {
      query.andWhere('(problem.title LIKE :search OR problem.description LIKE :search)', { search: `%${search}%` });
    }

    const totalCount = await query.getCount();
    const problems = await query.skip(skip).take(limit).getMany();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: problems,
    };
  }

  async getProblem(filter: FindOneOptions<Problem>['where'], options?: FindOneOptions<Problem>) {
    const problem = await this.problemRepository.findOne({
      where: filter,
      ...options,
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async updateProblem(id: string, input: UpdateProblemInput) {
    const { testCases, ...updateData } = input;

    // First update the problem data
    await this.problemRepository.update(id, updateData);

    // If test cases are provided, handle them
    if (testCases && testCases.length > 0) {
      // Get the problem with existing test cases
      const problem = await this.problemRepository.findOne({
        where: { id },
        relations: ['testCases'],
      });

      if (!problem) {
        throw new NotFoundException('Problem not found');
      }

      // Delete existing test cases in bulk if they exist
      if (problem.testCases && problem.testCases.length > 0) {
        const testCaseIds = problem.testCases.map((tc) => tc.id);
        // TODO: Queue
        await this.testCaseRepository.delete(testCaseIds);
      }

      const testCaseEntities = testCases.map((testCase) => ({
        ...testCase,
        problem: { id },
      }));

      // Bulk insert all test cases at once
      await this.testCaseRepository.insert(testCaseEntities);
    }

    // Get the updated problem with test cases
    return this.getProblem({ id });
  }

  async removeProblem(id: string) {
    const problem = await this.problemRepository.delete(id);

    if (problem.affected === 0) {
      throw new NotFoundException('Problem not found');
    }
  }

  async getAllTags() {
    // Get all unique tags from problems
    const problems = await this.problemRepository.find();
    const allTags = problems.flatMap((problem) => problem.tags);
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags;
  }

  async getAllDifficulties() {
    const difficulties = Object.values(Difficulty);

    return difficulties;
  }

  async getProblems(filter: FindOneOptions<Problem>['where'], options?: FindOneOptions<Problem>) {
    const problem = await this.problemRepository.find({
      where: filter,
      ...options,
    });

    return problem;
  }
}
