import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async addUClass(user: { email: string }) {
    return this.prismaService.userClass.create({
      data: { user: { connect: { email: user.email } } },
    });
  }

  async addGClass(data: { className: string; description: string }, user: { email: string; userClassUid: string }) {
    return this.prismaService.groupClass.create({
      data: {
        className: data.className,
        description: data.description,
        owner: {
          connect: {
            email: user.email,
          },
        },
        userClass: {
          connect: {
            uid: user.userClassUid,
          },
        },
      },
    });
  }

  async getUClass(user: { email: string }) {
    return await this.prismaService.userClass.findFirst({
      where: { user },
      include: {
        groupClass: {
          select: {
            id: true,
            className: true,
            description: true,
            owner: { select: { email: true } },
          },
        },
      },
    });
  }

  async updateClass(where: { id: number }, data: { className: string; description: string }) {
    return this.prismaService.groupClass.update({
      where,
      data,
    });
  }
}
