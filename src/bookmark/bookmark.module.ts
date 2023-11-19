import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkResolver } from './bookmark.resolver';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarkModule {}
