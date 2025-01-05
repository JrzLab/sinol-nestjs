import { Test, TestingModule } from '@nestjs/testing';
import { SubjectPrismaService } from './subject-prisma.service';

describe('SubjectPrismaService', () => {
  let service: SubjectPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectPrismaService],
    }).compile();

    service = module.get<SubjectPrismaService>(SubjectPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
