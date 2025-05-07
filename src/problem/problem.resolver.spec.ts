import { Test, TestingModule } from '@nestjs/testing';
import { ProblemResolver } from './problem.resolver';
import { ProblemService } from './problem.service';

describe('ProblemResolver', () => {
  let resolver: ProblemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProblemResolver, ProblemService],
    }).compile();

    resolver = module.get<ProblemResolver>(ProblemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
