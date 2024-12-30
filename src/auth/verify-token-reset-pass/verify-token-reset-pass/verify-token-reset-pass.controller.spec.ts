import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenResetPassController } from './verify-token-reset-pass.controller';

describe('VerifyTokenResetPassController', () => {
  let controller: VerifyTokenResetPassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyTokenResetPassController],
    }).compile();

    controller = module.get<VerifyTokenResetPassController>(VerifyTokenResetPassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
