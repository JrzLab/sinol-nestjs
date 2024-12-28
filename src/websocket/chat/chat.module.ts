import { Module } from '@nestjs/common';
import { WebsocketChatController } from './chat/chat.controller';
import { WebsocketChatGateway } from './chat/chat.gateway';
import { WebsocketChatService } from './chat/chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketGatewaySelf } from '../websocket-self.gateway';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketChatService, WebsocketChatGateway, WebsocketGatewaySelf],
  controllers: [WebsocketChatController],
})
export class WebsocketChatModule {}
