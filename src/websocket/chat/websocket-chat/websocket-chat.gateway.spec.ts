import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketChatGateway } from './websocket-chat.gateway';

describe('ChatGateway', () => {
  let gateway: WebsocketChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketChatGateway],
    }).compile();

    gateway = module.get<WebsocketChatGateway>(WebsocketChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
