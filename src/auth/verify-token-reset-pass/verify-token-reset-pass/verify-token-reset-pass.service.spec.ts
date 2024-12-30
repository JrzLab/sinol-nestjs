import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenResetPassService } from './verify-token-reset-pass.service';

describe('VerifyTokenResetPassService', () => {
  let service: VerifyTokenResetPassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyTokenResetPassService],
    }).compile();

    service = module.get<VerifyTokenResetPassService>(VerifyTokenResetPassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
