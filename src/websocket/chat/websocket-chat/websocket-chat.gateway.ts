import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';
import { CreateMessageDto } from 'src/dto/websocket/send-message-dto';
import { WebsocketSelfService } from 'src/websocket/websocket-self/websocket-self.service';
import { ApiTags } from '@nestjs/swagger';

/*
 * For Chat user
 */

@ApiTags('Websocket Chat')
@Injectable()
@WebSocketGateway(Number(process.env.PORT_WS))
export class WebsocketChatGateway {
  constructor(
    private readonly websocketService: WebsocketPrismaService,
    private readonly websocketSelfService: WebsocketSelfService,
  ) {}

  /**
   * Menghandle event `sendMessage` untuk mengirim pesan antar pengguna.
   *
   * @param data - Data pesan yang dikirim
   */

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateMessageDto) {
    const { identifySender, identifyReciver, message, idRoom } = data;
    const addMessage = await this.websocketService.addMessage({
      id: Number(idRoom),
      emailUser: identifySender,
      content: message,
    });

    // Mengirim pesan ke klien yang relevan
    [identifySender, identifyReciver].forEach((id) => {
      try {
        this.websocketSelfService.getClient(id).emit('updateMessageClient', addMessage);
      } catch {}
    });
  }
}
