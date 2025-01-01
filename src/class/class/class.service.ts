import { Injectable } from '@nestjs/common';
import { ClassPrismaService } from 'src/prisma/class/classPrisma.service';

@Injectable()
export class ClassService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  async getClass(email: string) {
    return this.classPrismaService.getClass({ email });
  }
}
