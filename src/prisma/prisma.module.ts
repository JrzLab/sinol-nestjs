import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { WebsocketService } from './websocket/websocket.service';

@Module({
  providers: [PrismaService, UserService, WebsocketService],
  exports: [UserService, WebsocketService],
})
export class PrismaModule {}
