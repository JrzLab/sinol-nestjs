import { Injectable } from '@nestjs/common';
import { ClassPrismaService } from 'src/prisma/class/class/classPrisma.service';

@Injectable()
export class ClassService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  async getClass(email: string) {
    return await this.classPrismaService.getClass(email);
  }
}
