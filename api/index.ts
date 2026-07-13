import { INestApplication } from '@nestjs/common';
import express from 'express';
import { createApp } from '../src/bootstrap';

const server = express();
let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await createApp(server);
    await app.init();
  }
  return server;
}

export default async (req, res) => {
  const instance = await bootstrap();
  instance(req, res);
};
