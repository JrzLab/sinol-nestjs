import { Module } from '@nestjs/common';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';

@Module({
  imports: [SignInModule, SignUpModule],
  exports: [SignInModule, SignUpModule],
})
export class AuthModule {}
