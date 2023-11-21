import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { ThumbnailInterceptor } from './interceptor';
import { ThumbnailValidatorPipe } from './pipe';

@ApiTags('bookmarks')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller('api/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @ApiOperation({
    summary: 'Create new bookmark',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(ThumbnailInterceptor())
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
    @UploadedFile(ThumbnailValidatorPipe()) thumbnail?: Express.Multer.File,
  ) {
    return this.bookmarkService.createBookmark(userId, dto, thumbnail);
  }

  @ApiOperation({
    summary: 'Get all bookmarks created by logged in user',
  })
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @ApiOperation({
    summary: 'Get bookmark by id created by logged in user',
  })
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @ApiOperation({
    summary: 'Update bookmark by id created by logged in user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(ThumbnailInterceptor())
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
    @UploadedFile(ThumbnailValidatorPipe()) thumbnail?: Express.Multer.File,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      dto,
      thumbnail,
    );
  }

  @ApiOperation({
    summary: 'Delete bookmark by id created by logged in user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
