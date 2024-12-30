import { Module } from '@nestjs/common';
import { VerifyTokenResetPassController } from './verify-token-reset-pass/verify-token-reset-pass.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth.service';
import { VerifyTokenResetPassService } from './verify-token-reset-pass/verify-token-reset-pass.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, VerifyTokenResetPassService],
  controllers: [VerifyTokenResetPassController]
})
export class VerifyTokenResetPassModule {}
