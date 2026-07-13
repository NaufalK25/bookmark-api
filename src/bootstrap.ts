import compression from 'compression';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { constants } from 'zlib';
import type { Express } from 'express';
import { AppModule } from './app.module';

export async function createApp(
  expressInstance?: Express,
): Promise<INestApplication> {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

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

  return app;
}
