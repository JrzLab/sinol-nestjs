import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';

type GroupClass = Prisma.groupClassGetPayload<{
  select: {
    uid: true;
    className: true;
    description: true;
    day: true;
    owner: {
      select: {
        email: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
  };
}>;

@Injectable()
export class ClassService {
  constructor(
    private readonly classPrismaService: ClassPrismaService,
    private readonly taskPrismaService: TaskPrismaService,
    private readonly websocketPrismaService: WebsocketPrismaService,
  ) {}

  private formatClassData({ uid, className, description, day, owner: { email, firstName, lastName, imageUrl } }: GroupClass) {
    return {
      uid: uid.split('-')[0],
      day,
      className,
      description,
      ownerData: {
        email,
        name: `${firstName}${lastName ? ` ${lastName}` : ''}`,
        imageUrl,
      },
    };
  }

  async addGClass(uid: string, className: string, description: string, email: string, day: number) {
    const groupClassData = (await this.classPrismaService.addGClass({ className, description, day }, { email, userClassUid: uid })).groupClass;

    if (!groupClassData) return {};

    return this.formatClassData(groupClassData);
  }

  async getUClass(uid: string) {
    const uClassData = await this.classPrismaService.getUClassData({ uid });
    return uClassData.map((data) => ({
      uid: data.groupClass.uid.split('-')[0],
      day: data.groupClass.day,
      className: data.groupClass.className,
      description: data.groupClass.description,
      ownerData: {
        email: data.groupClass.owner.email,
        name: `${data.groupClass.owner.firstName}${data.groupClass.owner.lastName ? ` ${data.groupClass.owner.lastName}` : ''}`,
        imageUrl: data.groupClass.owner.imageUrl,
      },
    }));
  }

  async getClassUsers(uid: string) {
    const classData = await this.classPrismaService.getClassUsers({ groupClassUid: uid });
    return classData && classData.joinClass
      ? classData.joinClass.map((data) => ({
          uid: data.userClass.uid.split('-')[0],
          email: data.userClass.user.email,
          name: `${data.userClass.user.firstName}${data.userClass.user.lastName ? ` ${data.userClass.user.lastName}` : ''}`,
          imageUrl: data.userClass.user.imageUrl,
          createdAt: data.createdAt,
        }))
      : [];
  }

  async joinClass(uidGroupClass: string, uidUserClass: string) {
    const classData = await this.classPrismaService.joinClass({ uidGroupClass, uidUserClass });

    if (!classData) return {};

    const roomChat = await this.websocketPrismaService.getRoomChat({
      emailUser1: classData.groupClass.owner.email,
      emailUser2: classData.userEmail,
      groupClassUid: classData.groupClass.uid,
    });

    if (!roomChat) {
      await this.websocketPrismaService.createRoom({
        emailUser1: classData.groupClass.owner.email,
        emailUser2: classData.userEmail,
        groupClassUid: classData.groupClass.uid,
      });
    }

    if (classData.groupClass.classSubject.length) {
      for (const subject of classData.groupClass.classSubject) {
        await this.taskPrismaService.addTask({ email: classData.userEmail, classSubjectId: subject.id });
      }
    }

    return this.formatClassData(classData.groupClass);
  }

  async leaveClass(uidGroupClass: string, uidUserClass: string) {
    const userClassData = await this.classPrismaService.leaveClass({ uidGroupClass, uidUserClass });

    if (!userClassData) return {};

    if (userClassData.groupClass) {
      if (userClassData.groupClass && userClassData.groupClass.classSubject.length) {
        const userTaskData = await this.taskPrismaService.getTask({
          email: userClassData.userEmail,
          classSubjectId: userClassData.groupClass.classSubject[0].id,
        });
        await this.taskPrismaService.deleteFileAndTask({ email: userClassData.userEmail, file: userTaskData.fileTask });
        await this.taskPrismaService.deleteUserTask({ userEmail: userClassData.userEmail });
      }
      await this.websocketPrismaService.deleteRoom({
        emailUser1: userClassData.groupClass.owner.email,
        emailUser2: userClassData.userEmail,
        groupClassUid: userClassData.groupClass.uid,
      });
    }

    return this.formatClassData(userClassData.groupClass);
  }

  async updateClass(uid: string, className: string, description: string, email: string, day: number) {
    const classData = await this.classPrismaService.updateClass({ uid }, { className, description, email, day });

    if (!classData) return { success: false, message: 'Class not found.', data: {} };
    if (typeof classData === 'string') return { success: false, message: 'You are not owner.', data: {} };

    return { success: true, message: 'Class updated successfully.', data: this.formatClassData(classData) };
  }

  async deleteClass(uid: string) {
    const groupClassData = await this.classPrismaService.deleteClass({ uid });

    if (!groupClassData) return {};

    return this.formatClassData(groupClassData);
  }
}
