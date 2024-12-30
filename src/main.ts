import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function startServer() {
  const app = await NestFactory.create(AppModule);

  // Configuration
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Menggunakan ValidationPipe secara global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak valid secara otomatis
      forbidNonWhitelisted: true, // Memunculkan error jika ada properti yang tidak valid
      transform: true, // Mengubah tipe data secara otomatis berdasarkan DTO
    }),
  );

  // Swagger configuration
  const swaggerData = JSON.parse(fs.readFileSync('settings-swagger.json', 'utf8'));
  const config = new DocumentBuilder().setTitle(swaggerData.title).setDescription(swaggerData.description).setVersion(swaggerData.version).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // app listening
  await app.listen(process.env.PORT);
}

startServer();
