import * as chalk from 'chalk';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    const dataPort = {
      port: this.configService.get<number>('PORT'),
      port_ws: this.configService.get<number>('PORT_WS'),
    };

    console.log(`${chalk.green('[Successfuly]')} You Can Access Documentation on: http://localhost:${dataPort.port}/docs`);
    console.log(`${chalk.green('[Successfuly]')} Application is running on: http://localhost:${dataPort.port}`);
    console.log(`${chalk.green('[Successfuly]')} Websocket is running on: http://localhost:${dataPort.port_ws}`);
  }

  getHello() {
    return {
      message: 'Welcome To Sinol API',
    };
  }
}
