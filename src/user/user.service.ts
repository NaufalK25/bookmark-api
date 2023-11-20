import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }

  async changePassword(
    userId: number,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    if (oldPassword === newPassword) {
      throw new ForbiddenException('Old and new password cannot be same');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access to resources denied');
    }

    const isOldPasswordMatches = await argon.verify(user.hash, oldPassword);

    if (!isOldPasswordMatches) {
      throw new ForbiddenException('Old password does not match');
    }

    const newHash = await argon.hash(newPassword);

    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: newHash,
      },
    });

    return newUser;
  }
}
