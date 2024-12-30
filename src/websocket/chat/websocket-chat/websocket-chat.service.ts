import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebsocketService } from 'src/prisma/websocket/websocket.service';

@Injectable()
export class WebsocketChatService {
  private readonly logger = new Logger(WebsocketChatService.name);
  constructor(private readonly websocketService: WebsocketService) {}

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
