import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { WebsocketService } from './websocket/websocket.service';
import { ClassPrismaService } from './class/class/classPrisma.service';

@Module({
  providers: [PrismaService, UserService, WebsocketService, ClassPrismaService],
  exports: [PrismaService, UserService, WebsocketService, ClassPrismaService],
})
export class PrismaModule {}
