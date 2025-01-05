import { Injectable } from '@nestjs/common';
import { ClassPrismaService } from 'src/prisma/class/classPrisma.service';

@Injectable()
export class ClassService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  async addGClass(uid: string, className: string, description: string, email: string) {
    return this.classPrismaService.addGClass({ className, description }, { email, userClassUid: uid });
  }

  async getUClass(email: string) {
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
