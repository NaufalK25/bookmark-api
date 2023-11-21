import * as fs from 'fs';
import * as path from 'path';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
    thumbnail?: Express.Multer.File,
  ) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
        thumbnail: thumbnail ? thumbnail.filename : 'thumbnail.jpg',
      },
    });

    bookmark.thumbnail = `${this.config.get('BASE_URL')}/upload/bookmarks/${
      bookmark.thumbnail
    }`;

    return bookmark;
  }

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    bookmarks.forEach((bookmark) => {
      bookmark.thumbnail = `${this.config.get('BASE_URL')}/upload/bookmarks/${
        bookmark.thumbnail
      }`;
    });

    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    bookmark.thumbnail = `${this.config.get('BASE_URL')}/upload/bookmarks/${
      bookmark.thumbnail
    }`;

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
    thumbnail?: Express.Multer.File,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const thumbnailPath = path.join(
      process.cwd(),
      'upload',
      'bookmarks',
      bookmark.thumbnail,
    );
    if (
      bookmark.thumbnail !== 'thumbnail.jpg' &&
      fs.existsSync(thumbnailPath)
    ) {
      fs.unlinkSync(thumbnailPath);
    }

    const editedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
        thumbnail: thumbnail ? thumbnail.filename : bookmark.thumbnail,
        updatedAt: new Date(),
      },
    });

    editedBookmark.thumbnail = `${this.config.get(
      'BASE_URL',
    )}/upload/bookmarks/${editedBookmark.thumbnail}`;

    return editedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const thumbnailPath = path.join(
      process.cwd(),
      'upload',
      'bookmarks',
      bookmark.thumbnail,
    );
    if (
      bookmark.thumbnail !== 'thumbnail.jpg' &&
      fs.existsSync(thumbnailPath)
    ) {
      fs.unlinkSync(thumbnailPath);
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmark.id,
      },
    });
  }
}
