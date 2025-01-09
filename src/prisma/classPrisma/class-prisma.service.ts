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

  async getUClass(user: { email?: string; uid?: string }) {
    const condition = user.email
      ? {
          user: {
            email: user.email,
          },
        }
      : {
          uid: {
            contains: user.uid,
          },
        };
    return await this.prismaService.userClass.findFirst({
      where: condition,
      include: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            owner: { select: { email: true } },
          },
        },
      },
    });
  }

  async updateClass(where: { uid: string }, data: { className: string; description: string }) {
    const groupClassData = await this.prismaService.groupClass.findFirst({
      where: {
        uid: {
          contains: where.uid,
        },
      },
    });
    return this.prismaService.groupClass.update({
      where: {
        uid: groupClassData.uid,
      },
      data,
    });
  }

  async deleteClass(where: { uid: string }) {
    const groupClassData = await this.prismaService.groupClass.findFirst({
      where: {
        uid: {
          contains: where.uid,
        },
      },
    });
    return this.prismaService.groupClass.delete({
      where: {
        uid: groupClassData.uid,
      },
    });
  }
}
