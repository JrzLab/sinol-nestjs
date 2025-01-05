import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';

@Injectable()
export class WebsocketChatService {
  private readonly logger = new Logger(WebsocketChatService.name);
  constructor(private readonly websocketService: WebsocketPrismaService) {}

  @Cron('0 0 * * *')
  async handleCron() {
    const roomData = await this.websocketService.getAllRoomWithExpiredAt();
    if (roomData.length) {
      this.logger.log(`Delete ${roomData.length} Room Expired History`);
      roomData.forEach(async (room) => {
        await this.websocketService.deleteRoomExpiredAt({ id: room.id });
      });
    }
  }
}
