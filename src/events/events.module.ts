import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketGateway],
  exports: [PrismaModule],
})
export class EventsModule {}
