import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketChatService } from './websocket-chat.service';

@WebSocketGateway(Number(process.env.PORT_WS) || 3001, { cors: true })
export class WebsocketChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clientsCollection: Map<string, Socket> = new Map();
  // constructor(
  //   private readonly websocketChatService: WebsocketChatService,
  // ){}

  handleConnection(@ConnectedSocket() socket: Socket) {
    const clientId = Array.isArray(socket.handshake.query.clientId) ? socket.handshake.query.clientId[0] : socket.handshake.query.clientId;
    if (clientId) {
      this.clientsCollection.set(clientId, socket);
      console.log(`Client connected with clientId: ${clientId}`);
    } else {
      console.log('Client connected without clientId');
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.clientsCollection.forEach((s, clientId) => {
      if (s.id === socket.id) {
        console.log(`Client with clientId: ${clientId} disconnected`);
        this.clientsCollection.delete(clientId);
      }
    });
  }
}
