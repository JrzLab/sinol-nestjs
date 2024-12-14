import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway(3001, { cors: true })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  handleConnection(@ConnectedSocket() socket: Socket) {
      const clientId = Array.isArray(socket.handshake.query.clientId) ? socket.handshake.query.clientId[0] : socket.handshake.query.clientId;
      console.log(`Client connected with clientId: ${clientId}`);
    if (clientId) {
      this.clients.set(clientId, socket);
    } else {
      console.log('Client connected without clientId');
    }
  }
  
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.clients.forEach((s, clientId) => {
      if (s.id === socket.id) {
        console.log(`Client with clientId: ${clientId} disconnected`);
        this.clients.delete(clientId);
      }
    });
  }
}