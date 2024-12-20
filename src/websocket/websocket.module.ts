import { Module } from '@nestjs/common';
import { WebsocketChatGateway } from './websocket-chat/websocket-chat.gateway';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketGateway, WebsocketChatGateway],
})
export class WebsocketModule {}
