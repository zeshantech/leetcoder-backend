import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { In, MoreThan, LessThan, LessThanOrEqual, FindOneOptions } from 'typeorm';
import { ContestRepository } from './contest.repository';
import { ContestRegistrationRepository } from './contest-registration.repository';
import { CreateContestInput, UpdateContestInput, GetContestsInput, GetContestLeaderboardInput } from './dto/contest.input';
import { ContestStatus } from '../common/types/common.types';
import { ProblemService } from 'src/problem/problem.service';
import { Contest } from './entities/contest.entity';
import { PaginationInput } from 'src/common/dto/input.dto';

@Injectable()
export class ContestService {
  constructor(
    private readonly contestRepository: ContestRepository,
    private readonly contestRegistrationRepository: ContestRegistrationRepository,
    private readonly problemService: ProblemService,
  ) {}

  async createContest(input: CreateContestInput) {
    const { problemIds, ...contestData } = input;

    const contest = this.contestRepository.create({
      ...contestData,
      status: ContestStatus.UPCOMING,
    });

    if (problemIds && problemIds.length > 0) {
      const problems = await this.problemService.getProblems({ id: In(problemIds) });
      contest.problems = problems;
    }

    const now = new Date();
    if (contest.startTime <= now) {
      contest.status = ContestStatus.ONGOING;
    }

    if (contest.endTime <= now) {
      contest.status = ContestStatus.FINISHED;
    }

    await this.contestRepository.save(contest);
    return contest;
  }

  async getAllContests(input: GetContestsInput) {
    await this.updateContestsStatus();

    const { page = 1, limit = 10, search, status, isActive, isPremium } = input || {};
    const skip = (page - 1) * limit;

    const query = this.contestRepository.createQueryBuilder('contest').leftJoinAndSelect('contest.problems', 'problems');

    if (search) {
      query.andWhere('(contest.title ILIKE :search OR contest.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      query.andWhere('contest.status = :status', { status });
    }

    if (isActive !== undefined) {
      query.andWhere('contest.isActive = :isActive', { isActive });
    }

    if (isPremium !== undefined) {
      query.andWhere('contest.isPremium = :isPremium', { isPremium });
    }

    const totalCount = await query.getCount();

    const contests = await query.orderBy('contest.startTime', 'DESC').skip(skip).take(limit).getMany();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: contests,
    };
  }

  async updateContestsStatus() {
    const now = new Date();
    await this.contestRepository.update({ startTime: LessThanOrEqual(now), endTime: MoreThan(now) }, { status: ContestStatus.ONGOING });
    await this.contestRepository.update({ endTime: LessThan(now) }, { status: ContestStatus.FINISHED });
  }

  async getContest(filters: FindOneOptions<Contest>['where'], options?: FindOneOptions<Contest>) {
    const contest = await this.contestRepository.findOne({ where: filters, ...options });
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  async updateContest(id: string, input: UpdateContestInput) {
    const contest = await this.getContest({ id });

    // Update status if start or end time changed
    if (input.startTime || input.endTime) {
      const startTime = input.startTime || contest.startTime;
      const endTime = input.endTime || contest.endTime;
      const now = new Date();

      if (startTime <= now && endTime > now) {
        input['status'] = ContestStatus.ONGOING;
      } else if (endTime <= now) {
        input['status'] = ContestStatus.FINISHED;
      } else if (startTime > now) {
        input['status'] = ContestStatus.UPCOMING;
      }
    }

    const updatedContest = await this.contestRepository.update(id, input);
    if (updatedContest.affected === 0) {
      throw new NotFoundException('Contest could not be updated');
    }

    return updatedContest;
  }

  async deleteContest(id: string) {
    const result = await this.contestRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Contest not found');
    }
  }

  async createContestRegistration(contestId: string, userId: string) {
    const registration = this.contestRegistrationRepository.create({
      contest: { id: contestId },
      user: { id: userId },
    });

    return this.contestRegistrationRepository.save(registration);
  }

  async registerForContest(contestId: string, user: CurrentUser) {
    const contest = await this.getContest({ id: contestId });

    // Check if contest is still open for registration
    const now = new Date();
    if (contest.startTime < now) {
      throw new ForbiddenException('Contest has already started, registration is closed');
    }

    const existingRegistration = await this.contestRegistrationRepository.findByContestIdAndUserId(contestId, user.id).getOne();
    if (existingRegistration) {
      throw new ConflictException('You are already registered for this contest');
    }

    const registration = await this.createContestRegistration(contestId, user.id);
    // TODO: Queue
    await this.contestRepository.update(contestId, {
      registeredParticipants: contest.registeredParticipants + 1,
    });

    return registration;
  }

  async getContestProblems(contestId: string) {
    const now = new Date();
    const contest = await this.getContest({ id: contestId }, { relations: ['problems'] });

    return {
      problemCount: contest.problems?.length || 0,
      problems: contest.startTime > now ? [] : contest.problems || [],
    };
  }

  async getContestLeaderboard(input: GetContestLeaderboardInput) {
    const { contestId, page = 1, limit = 10 } = input;

    const contest = await this.getContest({ id: contestId }, { relations: ['user'] });

    // Update the leaderboard rankings
    await this.contestRegistrationRepository.updateLeaderboard(contestId);

    const query = this.contestRegistrationRepository.findByContestId(contestId, input, { by: 'rank' }, ['user']);
    const totalCount = await query.getCount();
    const registrations = await query.getMany();

    return {
      contest,
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: registrations,
    };
  }

  async addProblemToContest(contestId: string, problemId: string) {
    const contest = await this.contestRepository.findById(contestId, ['problems']).getOne();

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    const problem = await this.problemService.getProblem({ id: problemId });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    if (!contest.problems) {
      contest.problems = [];
    }

    const problemExists = contest.problems.some((p) => p.id === problemId);
    if (problemExists) {
      return contest;
    }

    contest.problems.push(problem);
    await this.contestRepository.save(contest);

    return contest;
  }

  async removeProblemFromContest(contestId: string, problemId: string) {
    const contest = await this.contestRepository.findById(contestId, ['problems']).getOne();

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (!contest.problems) {
      throw new NotFoundException('Contest does not have any problems');
    }

    contest.problems = contest.problems.filter((p) => p.id !== problemId);
    await this.contestRepository.save(contest);

    return contest;
  }

  // New methods for contest submissions and user progress

  async getUserContestParticipation(input: PaginationInput, user: CurrentUser) {
    const { page = 1, limit = 10 } = input;

    const query = this.contestRegistrationRepository.findByUserId(user.id, input, { by: 'createdAt', order: 'DESC' }, ['contest']);
    const totalCount = await query.getCount();
    const registrations = await query.getMany();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: registrations,
    };
  }

  async getUserContestSubmissions(contestId: string, input: PaginationInput, user: CurrentUser) {
    // This would need to be implemented with a submissions repository
    // to get all submissions related to a contest by a specific user
    return {
      message: 'Contest submissions feature would be integrated with the submission service',
      // Would return submissions data
    };
  }

  async updateContestScore(contestId: string, pointsToAdd: number, user: CurrentUser) {
    const registration = await this.contestRegistrationRepository.findByContestIdAndUserId(contestId, user.id).getOne();
    if (!registration) {
      throw new NotFoundException('Contest registration not found');
    }

    registration.score += pointsToAdd;
    await this.contestRegistrationRepository.save(registration);

    // Update leaderboard after score change
    // TODO: Queue
    await this.contestRegistrationRepository.updateLeaderboard(contestId);
  }

  async getUpcomingContests(input: PaginationInput) {
    const { page = 1, limit = 10 } = input;

    const query = this.contestRepository.findUpcomingContests(input, { by: 'startTime' });
    const [contests, totalCount] = await query.getManyAndCount();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: contests,
    };
  }

  async getOngoingContests(input: PaginationInput) {
    const { page = 1, limit = 10 } = input;

    const query = this.contestRepository.findOngoingContests(input, { by: 'endTime' });
    const [contests, totalCount] = await query.getManyAndCount();

    return {
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      docs: contests,
    };
  }

  async checkUserEligibility(contestId: string, user: CurrentUser) {
    const contest = await this.getContest({ id: contestId });

    if (!contest.isActive) {
      return {
        eligible: false,
        message: 'This contest is currently not active',
        contest,
      };
    }

    // Check if contest requires premium and if user has premium
    if (contest.isPremium) {
      // This would need to be integrated with a user subscription service
      // For now, we'll just assume the user isn't premium
      return {
        eligible: false,
        message: 'This contest requires premium membership',
        contest,
      };
    }

    // Check contest status
    const now = new Date();
    if (contest.startTime > now) {
      // Contest hasn't started yet
      const registration = await this.contestRegistrationRepository.findByContestIdAndUserId(contestId, user.id).getOne();

      return {
        eligible: true,
        registered: !!registration,
        message: registration ? 'You are registered for this upcoming contest' : 'You can register for this upcoming contest',
        contest,
      };
    }

    if (contest.endTime < now) {
      return {
        eligible: false,
        message: 'This contest has already ended',
        contest,
      };
    }

    if (contest.startTime <= now && contest.endTime >= now) {
      // Contest is ongoing, check if user is registered
      const registration = await this.contestRegistrationRepository.findByContestIdAndUserId(contestId, user.id).getOne();

      if (!registration) {
        return {
          eligible: false,
          message: 'You are not registered for this contest',
          contest,
        };
      }
    }

    return {
      eligible: true,
      registered: true,
      message: 'You are eligible to participate in this contest',
      contest,
    };
  }
}
