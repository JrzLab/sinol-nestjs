import { Module } from '@nestjs/common';
import { WebsocketChatController } from './websocket-chat/websocket-chat.controller';
import { WebsocketChatGateway } from './websocket-chat/websocket-chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketSelfGateway } from '../websocket-self/websocket-self.gateway';
import { WebsocketSelfService } from '../websocket-self/websocket-self.service';
import { WebsocketChatService } from './websocket-chat/websocket-chat.service';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketChatGateway, WebsocketSelfGateway, WebsocketSelfService, WebsocketChatService],
  controllers: [WebsocketChatController],
})
export class WebsocketChatModule {}
