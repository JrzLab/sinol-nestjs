import { Module } from '@nestjs/common';
import { WebsocketGatewaySelf } from './websocket-self.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketChatGateway } from './websocket-chat/websocket-chat.gateway';
import { WebsocketChatService } from './websocket-chat/websocket-chat.service';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketGatewaySelf, WebsocketChatService, WebsocketChatGateway],
})
export class WebsocketSelfModule {}
