import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SignInController],
  providers: [SignInService]
})
export class SignInModule {}
