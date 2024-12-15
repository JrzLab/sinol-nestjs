import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';

@Module({
  controllers: [SignInController],
  providers: [SignInService]
})
export class SignInModule {}
