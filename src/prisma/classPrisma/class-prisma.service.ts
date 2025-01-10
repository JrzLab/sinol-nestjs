import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  private searchUserClass(data: { uid: string }) {
    return this.prismaService.userClass.findFirst({
      where: {
        uid: {
          contains: data.uid,
        },
      },
    });
  }

  private searchGroupClass(data: { uid: string }) {
    return this.prismaService.groupClass.findFirst({
      where: {
        uid: {
          contains: data.uid,
        },
      },
    });
  }

  async getUClass(user: { email: string }) {
    return this.prismaService.userClass.findFirst({
      where: {
        user: {
          email: user.email,
        },
      },
    });
  }

  async addUClass(user: { email: string }) {
    return this.prismaService.userClass.create({
      data: { user: { connect: { email: user.email } } },
    });
  }

  async addGClass(data: { className: string; description: string }, user: { email: string; userClassUid: string }) {
    const groupClassData = await this.prismaService.groupClass.create({
      data: {
        className: data.className,
        description: data.description,
        owner: {
          connect: {
            email: user.email,
          },
        },
      },
    });

    const userClassData = await this.searchUserClass({ uid: user.userClassUid });

    return this.prismaService.joinClass.create({
      data: {
        userClass: {
          connect: {
            uid: userClassData.uid,
          },
        },
        groupClass: {
          connect: {
            uid: groupClassData.uid,
          },
        },
      },
      select: {
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

  async getUClassData(user: { uid: string }) {
    return this.prismaService.joinClass.findMany({
      where: {
        userClass: {
          uid: {
            contains: user.uid,
          },
        },
      },
      select: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            owner: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async joinClass(data: { uidGroupClass: string; uidUserClass: string }) {
    const userClassData = await this.searchUserClass({ uid: data.uidUserClass });
    const groupClassData = await this.searchGroupClass({ uid: data.uidGroupClass });
    return this.prismaService.joinClass.create({
      data: {
        userClass: {
          connect: {
            uid: userClassData.uid,
          },
        },
        groupClass: {
          connect: {
            uid: groupClassData.uid,
          },
        },
      },
      select: {
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
    const groupClassData = await this.searchGroupClass({ uid: where.uid });
    return this.prismaService.groupClass.update({
      where: {
        uid: groupClassData.uid,
      },
      data,
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async deleteClass(where: { uid: string }) {
    const groupClassData = await this.searchGroupClass({ uid: where.uid });
    await this.prismaService.joinClass.deleteMany({
      where: {
        groupClass: {
          uid: {
            contains: groupClassData.uid,
          },
        },
      },
    });

    return this.prismaService.groupClass.delete({
      where: {
        uid: groupClassData.uid,
      },
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
