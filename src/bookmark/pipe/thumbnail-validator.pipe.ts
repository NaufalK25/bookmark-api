import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const ThumbnailValidatorPipe = () => {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /jpg|jpeg|png/,
    })
    .addMaxSizeValidator({
      maxSize: 10_000_000,
      message: 'Max image size is 10 MB',
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      fileIsRequired: false,
    });
};
