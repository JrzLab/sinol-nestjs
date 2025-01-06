import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserPrismaService } from './userPrisma/user-prisma.service';
import { WebsocketPrismaService } from './websocketPrisma/websocket-prisma.service';
import { ClassPrismaService } from './classPrisma/class-prisma.service';
import { SubjectPrismaService } from './subjectPrisma/subject-prisma.service';
import { TaskPrismaService } from './task-prisma/task-prisma.service';

const services = [PrismaService, UserPrismaService, WebsocketPrismaService, ClassPrismaService, SubjectPrismaService, TaskPrismaService];

@Module({
  providers: services,
  exports: services,
})
export class PrismaModule {}
