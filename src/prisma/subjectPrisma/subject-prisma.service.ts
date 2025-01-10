import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSubject(where: { groupClass: { uid: string } }) {
    return this.prismaService.classSubject.findMany({
      where: {
        groupClass: {
          uid: {
            contains: where.groupClass.uid,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addSubject(data: { title: string; description: string; maxScore: number; dueDate: Date; groupClass: { uid: string } }) {
    const classGroupData = await this.prismaService.groupClass.findFirst({
      where: {
        uid: {
          contains: data.groupClass.uid,
        },
      },
    });
    return this.prismaService.classSubject.create({
      data: {
        title: data.title,
        description: data.description,
        maxScore: data.maxScore,
        dueDateAt: data.dueDate,
        groupClass: {
          connect: {
            uid: classGroupData.uid,
          },
        },
      },
    });
  }

  async editSubject(where: { id: number }, data: { title: string; description: string, maxScore: number, dueDate: Date }) {
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
