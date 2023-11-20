import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  private baseUrl: string;
  constructor(config: ConfigService) {
    this.baseUrl = config.get('BASE_URL');
  }

  @ApiTags('welcome')
  @Get()
  getWelcome() {
    return {
      statusCode: 200,
      message: 'Welcome to Bookmark API',
      data: {
        api: {
          endpoint: `${this.baseUrl}/api`,
          docs: `${this.baseUrl}/api/docs`,
        },
        graphql: `${this.baseUrl}/graphql`,
      },
    };
  }

  @ApiTags('welcome')
  @Get('/api')
  getWelcomeApi() {
    return {
      statusCode: 200,
      message: 'Welcome to Bookmark API',
      data: {
        endpoint: `${this.baseUrl}/api`,
        docs: `${this.baseUrl}/api/docs`,
      },
    };
  }
}
