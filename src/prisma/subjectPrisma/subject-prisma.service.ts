import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { statusSubject } from '@prisma/client';

@Injectable()
export class SubjectPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllSubject() {
    return this.prismaService.classSubject.findMany({
      where: { dueDateAt: { lte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubject(where: { groupClass: { uid: string } }) {
    return this.prismaService.classSubject.findMany({
      where: { groupClass: { uid: { contains: where.groupClass.uid } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSubject(data: { title: string; description: string; maxScore: number; dueDate: Date; groupClass: { uid: string } }) {
    const classGroupData = await this.prismaService.groupClass.findFirst({
      where: { uid: { contains: data.groupClass.uid } },
    });
    return this.prismaService.classSubject.create({
      data: {
        title: data.title,
        description: data.description,
        maxScore: data.maxScore,
        dueDateAt: data.dueDate,
        groupClass: { connect: { uid: classGroupData.uid } },
      },
      include: {
        groupClass: {
          select: {
            joinClass: {
              select: {
                userClass: {
                  select: {
                    user: { select: { id: true, email: true, firstName: true, lastName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async editSubject(where: { id: number }, data: { title: string; description: string; maxScore: number; dueDate: Date }) {
    return this.prismaService.classSubject.update({
      where,
      data: {
        title: data.title,
        description: data.description,
        maxScore: data.maxScore,
        dueDateAt: data.dueDate,
      },
    });
  }

  async updateStatusSubject(where: { id: number }, data: { status: statusSubject }) {
    return this.prismaService.classSubject.update({
      where,
      data,
    });
  }

  async deleteSubject(where: { id: number }) {
    await this.prismaService.fileTask.deleteMany({ where: { userTask: { classSubjectId: where.id } } });
    await this.prismaService.userTask.deleteMany({ where: { classSubjectId: where.id } });
    return this.prismaService.classSubject.delete({ where });
  }
}
