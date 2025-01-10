import { Injectable } from '@nestjs/common';
import { groupClass, Prisma } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';

type GroupClass = Prisma.groupClassGetPayload<{
  select: {
    uid: true;
    className: true;
    description: true;
    owner: {
      select: {
        email: true;
      };
    };
  };
}>;

@Injectable()
export class ClassService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  private formatClassData({ uid, className, description, owner: { email } }: GroupClass) {
    return { uid: uid.split('-')[0], className, description, owner: email };
  }

  async addGClass(uid: string, className: string, description: string, email: string) {
    const classData = await this.classPrismaService.addGClass({ className, description }, { email, userClassUid: uid });
    return this.formatClassData(classData.groupClass);
  }

  async getUClass(uid: string) {
    return this.classPrismaService.getUClassData({ uid });
  }

  async joinClass(uidGroupClass: string, uidUserClass: string) {
    const classData = await this.classPrismaService.joinClass({ uidGroupClass, uidUserClass });
    return this.formatClassData(classData.groupClass);
  }

  async updateClass(uid: string, className: string, description: string) {
    const classData = await this.classPrismaService.updateClass({ uid }, { className, description });
    return this.formatClassData(classData);
  }

  async deleteClass(uid: string) {
    const classData = await this.classPrismaService.deleteClass({ uid });
    return this.formatClassData(classData);
  }
}
