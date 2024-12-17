import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [SignInController],
  providers: [SignInService, AuthService],
})
export class SignInModule {}
