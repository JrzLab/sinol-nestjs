import { Module } from '@nestjs/common';
import { WebsocketChatModule } from './chat/websocket-chat.module';

@Module({
  imports: [WebsocketChatModule],
})
export class WebsocketSelfModule {}
