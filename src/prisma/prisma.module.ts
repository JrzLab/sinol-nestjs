import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserPrismaService } from './user/userPrisma.service';
import { WebsocketPrismaService } from './websocket/websocketPrisma.service';
import { ClassPrismaService } from './class/classPrisma.service';

@Module({
  providers: [PrismaService, UserPrismaService, WebsocketPrismaService, ClassPrismaService],
  exports: [PrismaService, UserPrismaService, WebsocketPrismaService, ClassPrismaService],
})
export class PrismaModule {}
