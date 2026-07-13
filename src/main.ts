import { ConfigService } from '@nestjs/config';
import { createApp } from './bootstrap';

async function bootstrap() {
  const app = await createApp();

  const configService = new ConfigService();
  const port = configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
