import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

/*
 * For Status user
 */

@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS), { cors: true })
export class WebsocketGatewaySelf implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clientsCollection: Map<string, Socket> = new Map();

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
        console.log(`Client disconnected with clientId: ${clientId}`);
        this.clientsCollection.delete(clientId);
      } else {
        console.log('Client disconnected without clientId');
      }
    });
  }

  getClient(clientId: string) {
    return this.clientsCollection.get(clientId);
  }
}
