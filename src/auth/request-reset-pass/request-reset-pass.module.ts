import { Module } from '@nestjs/common';
import { RequestResetPassController } from './request-reset-pass/request-reset-pass.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth.service';
import { RequestResetPassService } from './request-reset-pass/request-reset-pass.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, RequestResetPassService],
  controllers: [RequestResetPassController],
})
export class RequestResetPassModule {}
