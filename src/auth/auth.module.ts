import { Module } from '@nestjs/common';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { LogoutModule } from './logout/logout.module';

@Module({
  imports: [SignInModule, SignUpModule, LogoutModule],
})
export class AuthModule {}
