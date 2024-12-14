import { Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  port: 3001,
  cors: { origin: '*' },
})
export class WebsocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
