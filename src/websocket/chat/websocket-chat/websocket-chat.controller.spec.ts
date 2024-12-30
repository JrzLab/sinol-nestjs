import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketChatController } from './websocket-chat.controller';

describe('ChatController', () => {
  let controller: WebsocketChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsocketChatController],
    }).compile();

    controller = module.get<WebsocketChatController>(WebsocketChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
