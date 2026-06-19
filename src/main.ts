import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/exception-filter';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for React frontend (Vite default port 5173)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // global guard
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  // global filters 
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); 



  await app.listen(3000); 
}
bootstrap();
