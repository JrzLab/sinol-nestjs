import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WebsocketPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(where: { emailUser1: string; emailUser2: string; groupClassUid: string }) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).setHours(23, 0, 0, 0);
    const roomData = await this.getMessageAndChatRoom({
      emailUser1: where.emailUser1,
      emailUser2: where.emailUser2,
      groupClassUid: where.groupClassUid,
    });
    return roomData
      ? roomData
      : this.prismaService.roomChat.create({
          data: {
            userA: { connect: { email: where.emailUser1 } },
            userB: { connect: { email: where.emailUser2 } },
            groupClass: { connect: { uid: where.groupClassUid } },
            expiredAt: new Date(expiredAt),
          },
        });
  }

  async getRoomChat(where: { emailUser1: string; emailUser2: string; groupClassUid: string }) {
    return this.prismaService.roomChat.findFirst({
      where: {
        userA: { email: where.emailUser1 },
        userB: { email: where.emailUser2 },
        groupClass: { uid: where.groupClassUid },
      },
    });
  }

  async getAllRoomWithExpiredAt() {
    return this.prismaService.roomChat.findMany({
      where: { expiredAt: { lte: new Date() } },
    });
  }

  async deleteRoomExpiredAt(where: { id: number }) {
    await this.prismaService.roomChat.update({
      where: { id: where.id },
      data: { expiredAt: null },
    });
    await this.prismaService.messageData.deleteMany({
      where: { roomChat: { id: where.id } },
    });
  }

  async deleteRoom(where: { emailUser1: string; emailUser2: string; groupClassUid: string }) {
    const roomData = await this.prismaService.roomChat.findFirst({
      where: {
        userA: { email: where.emailUser1 },
        userB: { email: where.emailUser2 },
        groupClass: { uid: where.groupClassUid },
      },
      select: { id: true },
    });

    await this.prismaService.messageData.deleteMany({
      where: {
        roomChatId: roomData.id,
      },
    });

    await this.prismaService.roomChat.delete({
      where: { id: roomData.id },
    });

    return roomData;
  }

  async addMessage(data: { id: number; emailUser: string; content: string }) {
    await this.prismaService.roomChat.update({
      where: { id: data.id },
      data: { expiredAt: new Date(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).setHours(23, 0, 0, 0)) },
    });
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

  async getMessageAndChatRoom(where: { emailUser1?: string; emailUser2?: string; groupClassUid?: string }) {
    const orCondition =
      where.emailUser1 && where.emailUser2
        ? [
            { AND: [{ userA: { email: where.emailUser1 } }, { userB: { email: where.emailUser2 } }] },
            { AND: [{ userA: { email: where.emailUser2 } }, { userB: { email: where.emailUser1 } }] },
          ]
        : undefined;

    return this.prismaService.roomChat.findFirst({
      where: {
        OR: orCondition,
        groupClass: { uid: where.groupClassUid },
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
