import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WebsocketService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(where: { emailUser1: string; emailUser2: string }) {
    const expiredAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    const roomData = this.getMessage(where);
    if (roomData) {
      return roomData;
    } else {
      return this.prismaService.roomChat.create({
        data: {
          userA: {
            connect: {
              email: where.emailUser1,
            },
          },
          userB: {
            connect: {
              email: where.emailUser2,
            },
          },
          expiredAt: expiredAt,
        },
      });
    }
  }

  async addMessage(data: { id: number; emailUser: string; content: string }) {
    const { id, emailUser, content } = data;
    return this.prismaService.messageData.create({
      data: {
        roomChat: {
          connect: {
            id,
          },
        },
        sender: {
          connect: {
            email: emailUser,
          },
        },
        content: content,
      },
    });
  }

  async getMessage(where: { emailUser1: string; emailUser2: string }) {
    return this.prismaService.roomChat.findFirst({
      where: {
        OR: [
          {
            AND: [{ userA: { email: where.emailUser1 } }, { userB: { email: where.emailUser2 } }],
          },
          {
            AND: [{ userA: { email: where.emailUser2 } }, { userB: { email: where.emailUser1 } }],
          },
        ],
      },
      include: {
        messages: {
          select: {
            uid: true,
            roomChatId: true,
            senderId: true,
            sender: {
              select: {
                email: true,
                firstName: true,
              },
            },
            content: true,
            messageTamp: true,
          },
        },
      },
    });
  }
}
