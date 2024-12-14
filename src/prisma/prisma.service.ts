import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('[Success] Database connected successfully');
    } catch (error) {
      console.error('[Failed] Failed to connect to the database', error);
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[Warn] Database disconnected');
  }
}
