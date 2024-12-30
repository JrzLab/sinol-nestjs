import { Test, TestingModule } from '@nestjs/testing';
import { SigninGoogleService } from './signin-google.service';

describe('SigninGoogleService', () => {
  let service: SigninGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SigninGoogleService],
    }).compile();

    service = module.get<SigninGoogleService>(SigninGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
