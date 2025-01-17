import * as chalk from 'chalk';
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    const dataPort = {
      web_url: this.configService.get<string>('WEB_URL'),
      port: this.configService.get<number>('PORT'),
      port_ws: this.configService.get<number>('PORT_WS'),
    };

    this.logger.log(`Website is running on: ${chalk.white(`${dataPort.web_url}`)}`);
    this.logger.log(`You Can Access Documentation on: ${chalk.white(`http://localhost:${dataPort.port}/docs`)}`);
    this.logger.log(`Application is running on: ${chalk.white(`http://localhost:${dataPort.port}`)}`);
    this.logger.log(` Websocket is running on: ${chalk.white(`http://localhost:${dataPort.port_ws}`)}`);
  }

  getHello() {
    return {
      message: 'Welcome To Sinol API',
    };
  }
}
