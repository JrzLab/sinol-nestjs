import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketSelfGateway } from './websocket-self.gateway';

describe('WebsocketSelfGateway', () => {
  let gateway: WebsocketSelfGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketSelfGateway],
    }).compile();

    gateway = module.get<WebsocketSelfGateway>(WebsocketSelfGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
