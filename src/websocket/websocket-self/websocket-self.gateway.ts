import * as chalk from 'chalk';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { WebsocketSelfService } from './websocket-self.service';

/*
 * For Status user
 */

@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS), { cors: true })
export class WebsocketSelfGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketSelfGateway.name);
  constructor(private websocketSelfService: WebsocketSelfService) {}
  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    const clientIdentify = Array.isArray(socket.handshake.query.clientIdentify)
      ? socket.handshake.query.clientIdentify[0]
      : socket.handshake.query.clientIdentify;
    if (clientIdentify) {
      const clinetCut = clientIdentify.split('@')[0];
      this.websocketSelfService.setClient(clinetCut, socket);
      this.logger.log(`${chalk.greenBright('[Joined]')} Client connected with clientId: ${clinetCut}`);
    } else {
      this.logger.log(`${chalk.greenBright('[Joined]')} Client connected without clientId`);
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.websocketSelfService.getAllClients().forEach((s, clientId) => {
      if (s.id === socket.id) {
        this.websocketSelfService.deleteClient(clientId);
        this.logger.log(`${chalk.redBright('[Leaved]')} Client disconnected with clientId: ${clientId}`);
      }
    });
  }
}
