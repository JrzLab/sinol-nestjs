import { Module } from '@nestjs/common';
import { WebsocketChatGateway } from './websocket-chat/websocket-chat.gateway';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketChatService } from './websocket-chat/websocket-chat.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketGateway, WebsocketChatGateway, WebsocketChatService],
})

export class WebsocketModule {}