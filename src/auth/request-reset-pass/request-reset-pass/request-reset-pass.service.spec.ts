import { Test, TestingModule } from '@nestjs/testing';
import { RequestResetPassService } from './request-reset-pass.service';

describe('RequestResetPassService', () => {
  let service: RequestResetPassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestResetPassService],
    }).compile();

    service = module.get<RequestResetPassService>(RequestResetPassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
