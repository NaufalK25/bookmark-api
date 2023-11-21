import * as multer from 'multer';
import * as path from 'path';
import { UnprocessableEntityException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const ThumbnailInterceptor = () => {
  return FileInterceptor('thumbnail', {
    storage: multer.diskStorage({
      destination(req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          return cb(
            new UnprocessableEntityException(
              'File must be either .jpg, .jpeg, or .png files',
            ),
            null,
          );
        }

        cb(null, path.join(process.cwd(), 'upload', 'bookmarks'));
      },
      filename: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          return cb(
            new UnprocessableEntityException(
              'File must be either .jpg, .jpeg, or .png files',
            ),
            null,
          );
        }

        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });
};
