import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';

@Module({
  providers: [PrismaService, UserService, ChatService],
  exports: [UserService, ChatService],
})
export class PrismaModule {}
