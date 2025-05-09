import { ObjectType } from '@nestjs/graphql';
import { Submission } from '../entities/submission.entity';
import { PaginatedOutput } from 'src/common/dto/output.dto';

@ObjectType()
export class GetSubmissionsOutput extends PaginatedOutput(Submission) {}
