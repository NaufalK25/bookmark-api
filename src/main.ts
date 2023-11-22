import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { constants } from 'zlib';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    .use(
      compression({
        level: constants.Z_BEST_COMPRESSION,
      }),
    );

  const config = new DocumentBuilder()
    .setTitle('Bookmark API')
    .setDescription('Rest API about bookmarking a link from a site')
    .setVersion('3.0.3')
    .addTag('welcome')
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'CRUD for user data')
    .addTag('bookmarks', 'CRUD for bookmark')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'access_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Bookmark API Docs',
  });

  await app.listen(3000);
}
bootstrap();
