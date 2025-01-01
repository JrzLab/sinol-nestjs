import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketPrismaService } from './websocketPrisma.service';

describe('WebsocketService', () => {
  let service: WebsocketPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketPrismaService],
    }).compile();

    service = module.get<WebsocketPrismaService>(WebsocketPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
