import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { IMessage, IChatRoom, IParticipant } from 'src/utility/interfaces/interface-websocket';

@WebSocketGateway(Number(process.env.PORT_WS) || 3001, { cors: true })
export class WebsocketChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clientsCollection: Map<string, Socket> = new Map();
  private roomsCollection: Map<string, IChatRoom> = new Map();
  private userStatus: Map<string, { isOnline: boolean; lastSeen: number }> = new Map();

  handleConnection(@ConnectedSocket() socket: Socket) {
    const clientId = Array.isArray(socket.handshake.query.clientId) ? socket.handshake.query.clientId[0] : socket.handshake.query.clientId;
    if (clientId) {
      this.clientsCollection.set(clientId, socket);
      this.userStatus.set(clientId, { isOnline: true, lastSeen: Date.now() });
      this.broadcastUserStatus(clientId, true);
      console.log(`Client connected with clientId: ${clientId}`);
      this.getConnectedUsers(socket);
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    let disconnectedClientId: string | null = null;
    this.clientsCollection.forEach((s, clientId) => {
      if (s.id === socket.id) {
        disconnectedClientId = clientId;
        this.clientsCollection.delete(clientId);
        this.userStatus.set(clientId, {
          isOnline: false,
          lastSeen: Date.now(),
        });
        this.broadcastUserStatus(clientId, false);
      }
    });
    if (disconnectedClientId) {
      console.log(`Client with clientId: ${disconnectedClientId} disconnected`);
      this.updateRoomParticipantStatus(disconnectedClientId, false);
    }
  }

  @SubscribeMessage('getConnectedUsers')
  getConnectedUsers(@ConnectedSocket() socket: Socket) {
    const connectedUsers = Array.from(this.userStatus.entries()).map(([userId, status]) => ({
      userId,
      isOnline: status.isOnline,
      lastSeen: status.lastSeen,
    }));
    socket.emit('connectedUsersList', { users: connectedUsers });
    console.log('Current connected users:', connectedUsers);
  }

  @SubscribeMessage('startPrivateChat')
  startPrivateChat(@MessageBody() data: { userId: string; otherUserId: string }, @ConnectedSocket() socket: Socket) {
    const { userId, otherUserId } = data;
    const roomId = this.generateRoomId(userId, otherUserId);

    if (!this.roomsCollection.has(roomId)) {
      this.roomsCollection.set(roomId, {
        roomId,
        participants: [],
        messages: [],
        roomCreatedAt: Date.now(),
        roomExpiredAt: Date.now() + 24 * 60 * 60 * 1000,
        lastActivity: Date.now(),
      });
    }

    const room = this.roomsCollection.get(roomId);
    room.participants = [];
    const userStatus = this.userStatus.get(userId);

    room.participants.push({
      socketId: socket.id,
      userId: userId,
      displayName: userId,
      role: 'admin',
      lastSeen: Date.now(),
      isOnline: userStatus?.isOnline || false,
    });

    const otherSocket = this.clientsCollection.get(otherUserId);
    const otherUserStatus = this.userStatus.get(otherUserId);
    if (otherSocket) {
      room.participants.push({
        socketId: otherSocket.id,
        userId: otherUserId,
        displayName: otherUserId,
        role: 'member',
        lastSeen: otherUserStatus?.lastSeen || Date.now(),
        isOnline: otherUserStatus?.isOnline || false,
      });
      otherSocket.join(roomId);
      otherSocket.emit('chatRoomJoined', {
        roomId,
        participants: room.participants,
        messages: room.messages,
      });
    }
    socket.join(roomId);
    socket.emit('chatRoomJoined', {
      roomId,
      participants: room.participants,
      messages: room.messages,
    });
    console.log(`Private chat started in room: ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() data: { roomId: string; userId: string; message: string }, @ConnectedSocket() socket: Socket) {
    const { roomId, userId, message } = data;
    const room = this.roomsCollection.get(roomId);

    if (room) {
      const newMessage: IMessage = {
        messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: userId,
        content: message,
        type: 'text',
        status: 'sent',
        createdAt: Date.now(),
      };

      room.messages.push(newMessage);
      room.lastActivity = Date.now();

      this.server.to(roomId).emit('receiveMessage', newMessage);

      room.participants.forEach((participant) => {
        if (participant.userId !== userId && participant.isOnline) {
          this.server.to(participant.socketId).emit('messageDelivered', {
            messageId: newMessage.messageId,
            roomId,
          });
        }
      });

      console.log(`Message sent in room ${roomId}`);
    }
  }

  @SubscribeMessage('messageRead')
  handleMessageRead(@MessageBody() data: { messageId: string; roomId: string; userId: string }, @ConnectedSocket() socket: Socket) {
    const { messageId, roomId, userId } = data;
    const room = this.roomsCollection.get(roomId);

    if (room) {
      const message = room.messages.find((msg) => msg.messageId === messageId);
      if (message) {
        message.status = 'read';
        this.server.to(roomId).emit('messageStatusUpdated', {
          messageId,
          status: 'read',
          userId,
        });
      }
    }
  }

  private generateRoomId(userId: string, otherUserId: string): string {
    const ids = [userId, otherUserId].sort();
    return `room-${ids[0]}-${ids[1]}`;
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    this.server.emit('userStatusChanged', {
      userId,
      isOnline,
      lastSeen: Date.now(),
    });
  }

  private updateRoomParticipantStatus(userId: string, isOnline: boolean) {
    this.roomsCollection.forEach((room) => {
      const participant = room.participants.find((p) => p.userId === userId);
      if (participant) {
        participant.isOnline = isOnline;
        participant.lastSeen = Date.now();

        this.server.to(room.roomId).emit('participantStatusChanged', {
          roomId: room.roomId,
          userId,
          isOnline,
          lastSeen: Date.now(),
        });
      }
    });
  }

  private cleanupExpiredRooms() {
    const now = Date.now();
    this.roomsCollection.forEach((room, roomId) => {
      if (now > room.roomExpiredAt) {
        this.roomsCollection.delete(roomId);
        console.log(`Room ${roomId} expired and was cleaned up`);
      }
    });
  }
}
