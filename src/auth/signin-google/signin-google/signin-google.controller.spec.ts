import { Test, TestingModule } from '@nestjs/testing';
import { SigninGoogleController } from './signin-google.controller';

describe('SigninGoogleController', () => {
  let controller: SigninGoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SigninGoogleController],
    }).compile();

    controller = module.get<SigninGoogleController>(SigninGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
