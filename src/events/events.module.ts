import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketChatGateway } from '../websocket/websocket-chat/websocket-chat.gateway';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [WebsocketGateway, WebsocketChatGateway],
  exports: [PrismaModule],
})
export class EventsModule {}
