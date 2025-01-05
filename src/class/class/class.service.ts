import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async addGClass(uid: string, className: string, description: string, email: string) {
    const uClassData = await this.classPrismaService.getUClass({ uid });
    return this.classPrismaService.addGClass({ className, description }, { email, userClassUid: uClassData.uid });
  }

  async getUClass(email: string): Promise<UserClassWithGroupClass> {
    const uClassData = await this.classPrismaService.getUClass({ email });
    if (!uClassData) {
      await this.classPrismaService.addUClass({ email });
      return this.getUClass(email);
    }
    return uClassData;
  }

  async updateClass(id: number, className: string, description: string) {
    return this.classPrismaService.updateClass({ id }, { className, description });
  }
}
