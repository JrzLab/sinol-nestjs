import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { WebsocketService } from 'src/prisma/websocket/websocket.service';
import { CreateMessageDto } from 'src/dto/websocket/send-message-dto';
import { WebsocketGatewaySelf } from 'src/websocket/websocket-self.gateway';
import { WebsocketChatService } from './chat.service';

/*
 * For Chat user
 */

@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS))
export class WebsocketChatGateway {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly websocketChatService: WebsocketChatService
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateMessageDto) {
    const { identifySender, identifyReciver, message, idRoom } = data;
    const addMessage = await this.websocketChatService.addMessage({
      id: Number(idRoom),
      emailUser: identifySender,
      content: message,
    });
    [identifySender, identifyReciver].forEach((id) => {
      try {
        this.websocketService.getClient(id).emit('updateMessageClient', addMessage);
      } catch (error) {}
    });
  }
}
