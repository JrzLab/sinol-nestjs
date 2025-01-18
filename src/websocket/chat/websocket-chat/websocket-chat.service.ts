import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';

@Injectable()
export class WebsocketChatService {
  private readonly logger = new Logger(WebsocketChatService.name);
  constructor(private readonly websocketPrismaService: WebsocketPrismaService) {}

  async getChatHistoryMessage(emailUser1: string, emailUser2: string) {
    return this.websocketPrismaService.getMessageAndChatRoom({ emailUser1, emailUser2 });
  }

  async getContactHistory(emailUser1: string, groupClassUid: string) {
    const roomData = await this.websocketPrismaService.getMessageDataAdmin({ emailUser1, groupClassUid });
    return roomData.map((data) => ({
      id: data.id,
      email: data.userB.email,
      imageUrl: data.userB.imageUrl,
      user: `${data.userB.firstName}${data.userB.lastName ? ` ${data.userB.lastName}` : ''}`,
      messages: {
        user: `${data.userB.firstName}${data.userB.lastName ? ` ${data.userB.lastName}` : ''}`,
        content: data.messages.length ? data.messages[0].content : '',
        messageTemp: data.messages.length ? data.messages[0].messageTemp : '',
        userEmail: data.userB.email,
      },
    }));
  }

  async getChatHistoryById(id: number) {
    return this.websocketPrismaService.getMessageDataById(id);
  }

  @Cron('0 0 * * *')
  async handleCron() {
    const roomData = await this.websocketPrismaService.getAllRoomWithExpiredAt();
    if (roomData.length) {
      this.logger.log(`Delete ${roomData.length} Room Expired History`);
      roomData.forEach(async (room) => {
        await this.websocketPrismaService.deleteRoomExpiredAt({ id: room.id });
      });
    }
  }
}
