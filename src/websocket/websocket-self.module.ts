import { Module } from '@nestjs/common';
import { WebsocketChatModule } from './chat/chat.module';

@Module({
  imports: [WebsocketChatModule],
})
export class WebsocketModuleSelf {}
