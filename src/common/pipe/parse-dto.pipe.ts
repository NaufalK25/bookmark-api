import { PipeTransform } from '@nestjs/common';

export class ParseDTOPipe implements PipeTransform {
  transform(dto: any) {
    return { ...dto };
  }
}
