import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiTags('welcome')
  @Get('/api')
  getWelcomeApi() {
    return {
      statusCode: 200,
      message: 'Welcome to Bookmark API',
    };
  }
}
