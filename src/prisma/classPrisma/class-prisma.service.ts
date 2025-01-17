import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  private searchUserClass(data: { uid: string }) {
    return this.prismaService.userClass.findFirst({
      where: { uid: { contains: data.uid } },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  }

  private searchGroupClass(data: { uid: string }) {
    return this.prismaService.groupClass.findFirst({
      where: { uid: { contains: data.uid } },
      include: { owner: { select: { email: true } } },
    });
  }

  async getUClass(user: { email: string }) {
    return this.prismaService.userClass.findFirst({
      where: { user: { email: user.email } },
    });
  }

  async addUClass(user: { email: string }) {
    return this.prismaService.userClass.create({
      data: { user: { connect: { email: user.email } } },
    });
  }

  async addGClass(data: { className: string; description: string; day: number }, user: { email: string; userClassUid: string }) {
    const groupClassData = await this.prismaService.groupClass.create({
      data: { ...data, owner: { connect: { email: user.email } } },
    });

    const userClassData = await this.searchUserClass({ uid: user.userClassUid });

    if (!userClassData) return null;

    return this.prismaService.joinClass.create({
      data: {
        userClass: { connect: { uid: userClassData.uid } },
        groupClass: { connect: { uid: groupClassData.uid } },
      },
      select: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            day: true,
            owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async getUClassData(user: { uid: string }) {
    return this.prismaService.joinClass.findMany({
      where: { userClass: { uid: { contains: user.uid } } },
      select: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            day: true,
            owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async getClassUsers(where: { groupClassUid: string }) {
    return this.prismaService.groupClass.findFirst({
      where: { uid: { contains: where.groupClassUid } },
      select: {
        joinClass: {
          select: {
            userClass: {
              select: {
                uid: true,
                user: {
                  select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                    imageUrl: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        },
      },
    });
  }

  async joinClass(data: { uidGroupClass: string; uidUserClass: string }) {
    const [userClassData, groupClassData] = await Promise.all([
      this.searchUserClass({ uid: data.uidUserClass }),
      this.searchGroupClass({ uid: data.uidGroupClass }),
    ]);

    if (!userClassData || !groupClassData) return null;

    let joinClassData = await this.prismaService.joinClass.findFirst({
      where: {
        userClassUid: userClassData.uid,
        groupClassUid: groupClassData.uid,
      },
      select: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            day: true,
            classSubject: { select: { id: true } },
            owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } },
          },
        },
        userClass: { select: { user: { select: { email: true } } } },
      },
    });

    if (!joinClassData) {
      joinClassData = await this.prismaService.joinClass.create({
        data: {
          userClass: { connect: { uid: userClassData.uid } },
          groupClass: { connect: { uid: groupClassData.uid } },
        },
        select: {
          groupClass: {
            select: {
              uid: true,
              className: true,
              description: true,
              day: true,
              classSubject: { select: { id: true } },
              owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } },
            },
          },
          userClass: { select: { user: { select: { email: true } } } },
        },
      });
    }

    return { userEmail: userClassData.user.email, ...joinClassData };
  }

  async leaveClass(data: { uidGroupClass: string; uidUserClass: string }) {
    const [userClassData, groupClassData] = await Promise.all([
      this.searchUserClass({ uid: data.uidUserClass }),
      this.searchGroupClass({ uid: data.uidGroupClass }),
    ]);

    if (!userClassData || !groupClassData) return null;

    const leaveClass = await this.prismaService.joinClass.findFirst({
      where: {
        userClassUid: userClassData.uid,
        groupClassUid: groupClassData.uid,
      },
      select: {
        groupClass: {
          select: {
            uid: true,
            className: true,
            description: true,
            day: true,
            classSubject: { select: { id: true } },
            owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } },
          },
        },
        userClass: { select: { user: { select: { email: true } } } },
      },
    });

    await this.prismaService.joinClass.deleteMany({
      where: {
        userClassUid: userClassData.uid,
        groupClassUid: groupClassData.uid,
      },
    });

    if (userClassData.user.email === groupClassData.owner.email) {
      await this.deleteClass({ uid: groupClassData.uid });
    }

    return { userEmail: userClassData.user.email, ...leaveClass };
  }

  async updateClass(where: { uid: string }, data: { className: string; description: string; email: string; day: number }) {
    const groupClassData = await this.searchGroupClass({ uid: where.uid });

    if (!groupClassData) return null;

    return groupClassData.owner.email === data.email
      ? this.prismaService.groupClass.update({
          where: { uid: groupClassData.uid },
          data: {
            className: data.className,
            description: data.description,
            day: data.day,
          },
          include: { owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } } },
        })
      : "You don't have permission to update this class";
  }

  async deleteClass(where: { uid: string }) {
    const groupClassData = await this.searchGroupClass({ uid: where.uid });

    if (!groupClassData) return null;

    const roomChat = await this.prismaService.roomChat.findFirst({
      where: { groupClassUid: groupClassData.uid },
      select: { id: true },
    });

    if (roomChat?.id) {
      await this.prismaService.messageData.deleteMany({ where: { roomChatId: roomChat.id } });
      await this.prismaService.roomChat.delete({ where: { id: roomChat.id } });
    }

    await this.prismaService.fileTask.deleteMany({
      where: { userTask: { classSubject: { groupClass: { uid: groupClassData.uid } } } },
    });

    await this.prismaService.userTask.deleteMany({
      where: { classSubject: { groupClass: { uid: groupClassData.uid } } },
    });

    await this.prismaService.classSubject.deleteMany({
      where: { groupClass: { uid: groupClassData.uid } },
    });

    await this.prismaService.joinClass.deleteMany({
      where: { groupClass: { uid: groupClassData.uid } },
    });

    return this.prismaService.groupClass.delete({
      where: { uid: groupClassData.uid },
      include: { owner: { select: { email: true, firstName: true, lastName: true, imageUrl: true } } },
    });
  }
}
