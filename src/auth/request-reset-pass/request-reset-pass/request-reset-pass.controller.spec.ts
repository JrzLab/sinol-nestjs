import { Test, TestingModule } from '@nestjs/testing';
import { RequestResetPassController } from './request-reset-pass.controller';

describe('RequestResetPassController', () => {
  let controller: RequestResetPassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestResetPassController],
    }).compile();

    controller = module.get<RequestResetPassController>(RequestResetPassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
