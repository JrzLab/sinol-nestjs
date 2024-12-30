import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketSelfService } from './websocket-self.service';

describe('WebsocketSelfService', () => {
  let service: WebsocketSelfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketSelfService],
    }).compile();

    service = module.get<WebsocketSelfService>(WebsocketSelfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
