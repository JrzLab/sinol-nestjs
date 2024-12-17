import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { ResetPasswordController } from './reset-password/reset-password.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth.service';

@Module({
  imports: [PrismaModule],
  providers: [ResetPasswordService, AuthService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
