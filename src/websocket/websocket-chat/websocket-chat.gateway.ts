import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { WebsocketService } from 'src/prisma/websocket/websocket.service';
import { CreateMessageDto } from 'src/dto/websocket/send-message-dto';
import { GetMessageDto } from 'src/dto/websocket/get-message-dto';

/*
 * For Chat user
 */

@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS))
export class WebsocketChatGateway {
  constructor(private readonly websocketService: WebsocketService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateMessageDto) {
    const { emailSender, emailReciver, message } = data;
    const createRoom = await this.websocketService.createRoom({ emailUser1: emailSender, emailUser2: emailReciver });
    const addMessage = await this.websocketService.addMessage({ id: createRoom.id, emailUser: emailSender, content: message });
    console.log('addMessage', addMessage);
  }

  @SubscribeMessage('getMessage')
  async handleGetMessage(@MessageBody() data: GetMessageDto) {
    const { emailSender, emailReciver } = data;
    const message = await this.websocketService.getMessage({ emailUser1: emailSender, emailUser2: emailReciver });
    console.log('message', message);
  }
}
