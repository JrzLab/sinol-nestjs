import { Injectable } from '@nestjs/common';
import { ChatService } from '../../prisma/chat/chat.service';

@Injectable()
export class WebsocketChatService {
    constructor(
        private readonly chatService: ChatService,
    ) {}

    async handleMessage(roomId: number, senderId: number, content: string): Promise<IMessageData> {
        const room = await this.chatService.getRoomByRoomId(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        return this.chatService.addMessage(room.id, senderId, content);
    }

    async fetchRoomMessages(roomId: number): Promise<IMessageData[]> {
        const room = await this.chatService.getRoomByRoomId(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        return this.chatService.getMessagesByRoomId(room.id);
    }
}
