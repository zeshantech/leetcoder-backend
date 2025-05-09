import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionService } from './submission.service';
import { SubmissionResolver } from './submission.resolver';
import { Submission } from './entities/submission.entity';
import { SubmissionRepository } from './submission.repository';
@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [SubmissionResolver, SubmissionService, SubmissionRepository],
  exports: [SubmissionService],
})
export class SubmissionModule {}
