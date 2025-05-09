import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionInput, GetSubmissionsInput } from './dto/submission.input';
import { SubmissionStatus } from '../common/types/common.types';
import { SubmissionRepository } from './submission.repository';

@Injectable()
export class SubmissionService {
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async submit(input: CreateSubmissionInput, user: CurrentUser) {
    const { code, language, problemId } = input;

    const submission = this.submissionRepository.create({
      code,
      language,
      problemId,
      user: { id: user.id },
      status: SubmissionStatus.PENDING,
    });

    const savedSubmission = await this.submissionRepository.save(submission);

    // In a real implementation, you would send this to a judge service/queue
    // For now, we'll just return the submission ID

    return savedSubmission;
  }

  async getAllSubmissions(input: GetSubmissionsInput, user: CurrentUser) {
    const query = this.submissionRepository.findByUserId(user.id, input, ['problem']);

    if (input.problemId) {
      query.andWhere('submission.problemId = :problemId', { problemId: input.problemId });
    }

    const totalCount = await query.getCount();

    const submissions = await query.orderBy('submission.submittedAt', 'DESC').getMany();

    return {
      totalCount,
      hasNextPage: input.page * input.limit < totalCount,
      hasPreviousPage: input.page > 1,
      currentPage: input.page,
      totalPages: Math.ceil(totalCount / input.limit),
      docs: submissions,
    };
  }

  async getSubmission(id: string, user: CurrentUser) {
    const submission = await this.submissionRepository.findByIdAndUser(id, user.id, ['problem']).getOne();

    if (!submission) {
      throw new NotFoundException('Submission not found or you do not have permission to view it');
    }

    return submission;
  }

  async checkStatus(id: string, user: CurrentUser) {
    const submission = await this.submissionRepository.findByIdAndUser(id, user.id).getOne();

    if (!submission) {
      throw new NotFoundException('Submission not found or you do not have permission to view it');
    }

    // In a real implementation, you would check the status of the submission
    // For now, we'll just simulate a status update

    // Mock submission completion
    if (submission.status === SubmissionStatus.PENDING) {
      submission.status = SubmissionStatus.ACCEPTED;
      submission.runtime = 100; // ms
      submission.memory = 10240; // KB

      await this.submissionRepository.save(submission);
    }

    return submission.status;
  }

  async getSubmissionsByProblemId(problemId: string, input: GetSubmissionsInput) {
    const query = this.submissionRepository.findByProblemId(problemId, input, ['problem']);

    const totalCount = await query.getCount();

    const submissions = await query.orderBy('submission.submittedAt', 'DESC').getMany();

    return {
      totalCount,
      hasNextPage: input.page * input.limit < totalCount,
      hasPreviousPage: input.page > 1,
      currentPage: input.page,
      totalPages: Math.ceil(totalCount / input.limit),
      docs: submissions,
    };
  }
}
