import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Project') // Set the title of the API
    .setDescription('Ecommerce API description') // Set the description of the API
    .setVersion('0.1') // Set the version of the API
    .build(); // Build the document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('v1/api');
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
