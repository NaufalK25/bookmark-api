import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookmarkService } from './bookmark.service';
import { GqlGetUser } from '../auth/decorator';
import { GqlJwtGuard } from '../auth/guard';
import { ParseDTOPipe } from '../common/pipes';

@UseGuards(GqlJwtGuard)
@Resolver('Bookmark')
export class BookmarkResolver {
  constructor(private bookmarkService: BookmarkService) {}

  @Mutation('createBookmark')
  createBookmark(
    @GqlGetUser('id') userId: number,
    @Args('dto', ParseDTOPipe) dto: any,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Query('getBookmarks')
  getBookmarks(@GqlGetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Query('getBookmarkById')
  getBookmarkById(
    @GqlGetUser('id') userId: number,
    @Args('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Mutation('editBookmarkById')
  editBookmarkById(
    @GqlGetUser('id') userId: number,
    @Args('bookmarkId', ParseIntPipe) bookmarkId: number,
    @Args('dto', ParseDTOPipe) dto: any,
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @Mutation('deleteBookmarkById')
  deleteBookmarkById(
    @GqlGetUser('id') userId: number,
    @Args('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
