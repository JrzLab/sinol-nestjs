import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) {}

    async createRoom(roomId: string, expiredAt: Date): Promise<IRoomChat> {
        return this.prismaService.roomChat.create({
            data: {
                roomId,
                expiredAt,
            },
        }) as unknown as IRoomChat;
    }

    async getRoomByRoomId(roomId: number): Promise<IRoomChat | null> {
        return this.prismaService.roomChat.findUnique({
            where: { id: roomId },
            include: { messages: true },
        }) as unknown as IRoomChat | null;
    }

    async addMessage(roomId: number, senderId: number, content: string): Promise<IMessageData> {
        return this.prismaService.messageData.create({
            data: {
                roomId,
                senderId,
                content,
            },
        }) as unknown as IMessageData;
    }

    async getMessagesByRoomId(roomId: number): Promise<IMessageData[]> {
        return this.prismaService.messageData.findMany({
            where: { roomId },
            orderBy: { messageTamp: 'asc' },
        }) as unknown as IMessageData[];
    }
}
