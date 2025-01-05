import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSubject(where: { groupClass: { id: number } }) {
    return this.prismaService.classSubject.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addSubject(data: { title: string; description: string; groupClass: { connect: { id: number } } }) {
    return this.prismaService.classSubject.create({
      data,
    });
  }

  async editSubject(where: { id: number }, data: { title: string; description: string }) {
    return this.prismaService.classSubject.update({
      where,
      data,
    });
  }

  async deleteSubject(where: { id: number }) {
    return this.prismaService.classSubject.delete({
      where,
    });
  }
}
