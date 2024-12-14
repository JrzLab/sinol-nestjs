import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function startServer() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const dataPort = {
    port: configService.get<number>('PORT'),
    port_ws: configService.get<number>('PORT_WS'),
  };
  app.enableCors();
  await app.listen(dataPort.port);
  console.log(`Application is running on: http://localhost:${dataPort.port}`);
  console.log(`Websocket is running on: http://localhost:${dataPort.port_ws}`);
}

startServer();
