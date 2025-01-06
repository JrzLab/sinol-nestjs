import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WebsocketSelfModule } from './websocket/websocket-self.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassModule } from './class/class.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    WebsocketSelfModule,
    ClassModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
