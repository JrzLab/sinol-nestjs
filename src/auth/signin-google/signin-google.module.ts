import { Module } from '@nestjs/common';
import { SigninGoogleService } from './signin-google/signin-google.service';
import { SigninGoogleController } from './signin-google/signin-google.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth.service';

@Module({
  imports: [PrismaModule],
  providers: [SigninGoogleService, AuthService],
  controllers: [SigninGoogleController],
})
export class SigninGoogleModule {}
