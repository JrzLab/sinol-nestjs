import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';

@Module({
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class PrismaModule {}
