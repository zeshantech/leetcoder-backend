import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeExecutionService } from './code-execution.service';
import { CodeExecutionResolver } from './code-execution.resolver';
import { CodeExecution } from './entities/code-execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeExecution])],
  providers: [CodeExecutionResolver, CodeExecutionService],
  exports: [CodeExecutionService],
})
export class CodeExecutionModule {}
