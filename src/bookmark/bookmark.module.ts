import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkResolver } from './bookmark.resolver';
import { BookmarkService } from './bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarkModule {}
