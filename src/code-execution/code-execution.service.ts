import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeExecution } from './entities/code-execution.entity';
import { ExecuteCodeInput } from './dto/code-execution.input';
import {
  CodeExecutionOutput,
  ExecutionResultOutput,
} from './dto/code-execution.output';
import { SubmissionStatus } from '../common/types/common.types';

@Injectable()
export class CodeExecutionService {
  constructor(
    @InjectRepository(CodeExecution)
    private readonly codeExecutionRepository: Repository<CodeExecution>,
  ) {}

  async executeCode(
    input: ExecuteCodeInput,
    userId: string,
  ): Promise<CodeExecutionOutput> {
    try {
      const { code, language, problemId } = input;

      // Create a new execution record
      const execution = this.codeExecutionRepository.create({
        code,
        language,
        problemId,
        userId,
        status: SubmissionStatus.PENDING,
      });

      const savedExecution = await this.codeExecutionRepository.save(execution);

      // In a real implementation, you would send this to an execution service/queue
      // For now, we'll just return the execution ID

      return {
        success: true,
        message: 'Code execution has been queued',
        executionId: savedExecution.id,
        status: SubmissionStatus.PENDING,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to execute code: ${error.message}`,
        executionId: '',
        status: SubmissionStatus.RUNTIME_ERROR,
      };
    }
  }

  async getExecutionResult(
    id: string,
    userId: string,
  ): Promise<ExecutionResultOutput> {
    try {
      const execution = await this.codeExecutionRepository.findOne({
        where: { id, userId },
      });

      if (!execution) {
        return {
          success: false,
          message:
            'Execution not found or you do not have permission to view it',
          executionId: id,
          status: SubmissionStatus.RUNTIME_ERROR,
        };
      }

      // In a real implementation, you would check the status of the execution
      // For now, we'll just return a mock result

      // Mock execution completion
      if (execution.status === SubmissionStatus.PENDING) {
        execution.status = SubmissionStatus.ACCEPTED;
        execution.output = 'Output from execution';
        execution.memory = 10240; // KB
        execution.runtime = 100; // ms
        execution.testCasesPassed = 10;
        execution.totalTestCases = 10;

        await this.codeExecutionRepository.save(execution);
      }

      return {
        success: true,
        executionId: execution.id,
        status: execution.status,
        output: execution.output,
        memory: execution.memory,
        runtime: execution.runtime,
        testCasesPassed: execution.testCasesPassed,
        totalTestCases: execution.totalTestCases,
        errorMessage: execution.errorMessage,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get execution result: ${error.message}`,
        executionId: id,
        status: SubmissionStatus.RUNTIME_ERROR,
      };
    }
  }
}
