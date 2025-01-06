import { Injectable } from '@nestjs/common';
import { groupClass, Prisma } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';

type UserClassWithGroupClass = Prisma.userClassGetPayload<{
  include: {
    groupClass: {
      select: {
        id: true;
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

  private formatClassData({ id, className, description, ownerId }: groupClass) {
    return { id, className, description, ownerId };
  }

  async addGClass(uid: string, className: string, description: string, email: string) {
    const { uid: userClassUid } = await this.classPrismaService.getUClass({ uid });
    const classData = await this.classPrismaService.addGClass({ className, description }, { email, userClassUid });
    return this.formatClassData(classData);
  }

  async getUClass(email: string): Promise<UserClassWithGroupClass> {
    let uClassData = await this.classPrismaService.getUClass({ email });
    if (!uClassData) {
      await this.classPrismaService.addUClass({ email });
      uClassData = await this.classPrismaService.getUClass({ email });
    }
    return uClassData;
  }

  async updateClass(id: number, className: string, description: string) {
    const classData = await this.classPrismaService.updateClass({ id }, { className, description });
    return this.formatClassData(classData);
  }

  async deleteClass(id: number) {
    const classData = await this.classPrismaService.deleteClass({ id });
    return this.formatClassData(classData);
  }
}
