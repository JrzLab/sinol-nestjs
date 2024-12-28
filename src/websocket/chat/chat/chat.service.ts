import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebsocketChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(where: { emailUser1: string; emailUser2: string }) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const roomData = await this.getMessageAndChatRoom({ emailUser1: where.emailUser1, emailUser2: where.emailUser2 });
    return roomData
      ? roomData
      : this.prismaService.roomChat.create({
          data: {
            userA: { connect: { email: where.emailUser1 } },
            userB: { connect: { email: where.emailUser2 } },
            expiredAt,
          },
        });
  }

  async addMessage(data: { id: number; emailUser: string; content: string }) {
    return this.prismaService.messageData.create({
      data: {
        roomChat: { connect: { id: data.id } },
        sender: { connect: { email: data.emailUser } },
        content: data.content,
      },
      include: {
        sender: { select: { email: true, firstName: true } },
      },
    });
  }

  async getMessageAndChatRoom(where: { id?: number; emailUser1?: string; emailUser2?: string }) {
    const orCondition =
      where.emailUser1 && where.emailUser2
        ? [
            { AND: [{ userA: { email: where.emailUser1 } }, { userB: { email: where.emailUser2 } }] },
            { AND: [{ userA: { email: where.emailUser2 } }, { userB: { email: where.emailUser1 } }] },
          ]
        : undefined;

    return this.prismaService.roomChat.findFirst({
      where: {
        id: where.id,
        OR: orCondition,
      },
      include: {
        messages: {
          orderBy: { messageTemp: 'asc' },
          select: {
            uid: true,
            roomChatId: true,
            senderId: true,
            sender: { select: { email: true, firstName: true } },
            content: true,
            messageTemp: true,
          },
        },
      },
    });
  }
}
