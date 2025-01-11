import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';

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
    const classData = await this.classPrismaService.addGClass({ className, description, day }, { email, userClassUid: uid });
    return this.formatClassData(classData.groupClass);
  }

  async getUClass(uid: string) {
    return this.classPrismaService.getUClassData({ uid });
  }

  async joinClass(uidGroupClass: string, uidUserClass: string) {
    const classData = await this.classPrismaService.joinClass({ uidGroupClass, uidUserClass });

    if (classData.groupClass.classSubject.length) {
      for (const subject of classData.groupClass.classSubject) {
        await this.taskPrismaService.addTask({ email: classData.userEmail, classSubjectId: subject.id });
      }
    }

    return this.formatClassData(classData.groupClass);
  }

  async updateClass(uid: string, className: string, description: string, email: string, day: number) {
    const classData = await this.classPrismaService.updateClass({ uid }, { className, description, email, day });

    if (!classData) return { success: false, message: 'You are not owner.', data: [] };

    return { success: true, message: 'Class updated successfully.', data: this.formatClassData(classData) };
  }

  async deleteClass(uid: string) {
    const classData = await this.classPrismaService.deleteClass({ uid });
    return this.formatClassData(classData);
  }
}
