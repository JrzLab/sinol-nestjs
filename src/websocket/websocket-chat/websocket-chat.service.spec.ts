import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketChatService } from './websocket-chat.service';

describe('WebsocketChatService', () => {
  let service: WebsocketChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketChatService],
    }).compile();

    service = module.get<WebsocketChatService>(WebsocketChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
