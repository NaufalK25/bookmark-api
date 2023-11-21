import * as path from 'path';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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

  @ApiTags('bookmarks')
  @ApiOperation({
    summary: 'Serve bookmark thumbnail',
  })
  @Get('/upload/bookmarks/:fileName')
  async serveBookmarkThumbnail(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    res.sendFile(fileName, { root: path.join('upload', 'bookmarks') });
  }
}
