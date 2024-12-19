import { Module } from '@nestjs/common';
import { LogoutController } from './logout/logout.controller';
import { LogoutService } from './logout/logout.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogoutController],
  providers: [LogoutService]
})
export class LogoutModule {}
