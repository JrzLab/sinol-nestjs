import { Test, TestingModule } from '@nestjs/testing';
import { ClassPrismaService } from './class-prisma.service';

describe('ClassService', () => {
  let service: ClassPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassPrismaService],
    }).compile();

    service = module.get<ClassPrismaService>(ClassPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
