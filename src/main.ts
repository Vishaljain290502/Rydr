import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './utils/global.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  // app.use(new AuthMiddleware().use);

  const config = new DocumentBuilder()
  .setTitle('Rider')
  .setDescription('The Rider APIs')
  .setVersion('1.0')
  .addTag('cats')
  .build();
   const document = SwaggerModule.createDocument(app, config)
   SwaggerModule.setup('api', app, document);

  await app.listen(3000);


}
bootstrap();
