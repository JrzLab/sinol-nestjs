import { Test, TestingModule } from '@nestjs/testing';
import { TaskPrismaService } from './task-prisma.service';

describe('TaskPrismaService', () => {
  let service: TaskPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskPrismaService],
    }).compile();

    service = module.get<TaskPrismaService>(TaskPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
