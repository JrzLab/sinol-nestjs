import { Injectable } from '@nestjs/common';
import { groupClass, Prisma } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';

type UserClassWithGroupClass = Prisma.userClassGetPayload<{
  include: {
    groupClass: {
      select: {
        uid: true;
        className: true;
        description: true;
        owner: { select: { email: true } };
      };
    };
  };
}>;

@Injectable()
export class ClassService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  private formatClassData({ uid, className, description, ownerId }: groupClass) {
    return { uid: uid.split('-')[0], className, description, ownerId };
  }

  async addGClass(uid: string, className: string, description: string, email: string) {
    const { uid: userClassUid } = await this.classPrismaService.getUClass({ uid });
    const classData = await this.classPrismaService.addGClass({ className, description }, { email, userClassUid });
    return this.formatClassData(classData);
  }

  async getUClass(email: string): Promise<UserClassWithGroupClass> {
    const uClassData = await this.classPrismaService.getUClass({ email });
    if (!uClassData) {
      await this.classPrismaService.addUClass({ email });
      return this.getUClass(email);
    }
    return uClassData;
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
