import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Your frontend URL
    credentials: true, // Allow cookies
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
  console.log('🚀 Server running on http://localhost:5000');
}
bootstrap();
