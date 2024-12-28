import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { WebsocketService } from 'src/prisma/websocket/websocket.service';

/*
 * For Status user
 */

@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS), { cors: true })
export class WebsocketGatewaySelf implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private websocketService: WebsocketService) {}
  @WebSocketServer() server: Server;
  

  handleConnection(@ConnectedSocket() socket: Socket) {
    // Testing
    const clientIdentify = Array.isArray(socket.handshake.query.clientIdentify) ? socket.handshake.query.clientIdentify[0] : socket.handshake.query.clientIdentify;
    // const clientId = Array.isArray(socket.handshake.query.clientId) ? socket.handshake.query.clientId[0] : socket.handshake.query.clientId;
    if (clientIdentify) {
      const clinetCut = clientIdentify.split("@")[0];
      this.websocketService.setClient(clinetCut, socket);
      // console.log(this.clientsCollection);
      console.log(`Client connected with clientId: ${clinetCut}`);
    } else {
      console.log('Client connected without clientId');
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.websocketService.getAllClients().forEach((s, clientId) => {
      if (s.id === socket.id) {
        console.log(`Client disconnected with clientId: ${clientId}`);
        this.websocketService.deleteClient(clientId);
      } else {
        console.log('Client disconnected without clientId');
      }
    });
  }
}
