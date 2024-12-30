import { Module } from '@nestjs/common';
import { SigninGoogleService } from './signin-google/signin-google.service';
import { SigninGoogleController } from './signin-google/signin-google.controller';
import  { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SigninGoogleService],
  controllers: [SigninGoogleController]
})
export class SigninGoogleModule {}
