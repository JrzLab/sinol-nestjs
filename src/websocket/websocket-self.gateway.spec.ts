import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGatewaySelf } from './websocket-self.gateway';

describe('WebsocketGatewaySelf', () => {
  let gateway: WebsocketGatewaySelf;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketGatewaySelf],
    }).compile();

    gateway = module.get<WebsocketGatewaySelf>(WebsocketGatewaySelf);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
