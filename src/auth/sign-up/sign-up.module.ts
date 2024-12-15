import { Module } from '@nestjs/common';
import { SignUpController } from './sign-up/sign-up.controller';
import { SignUpService } from './sign-up/sign-up.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
