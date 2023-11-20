import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ChangePasswordDto, EditUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
  constructor(private userSerice: UserService) {}

  @ApiOperation({
    summary: 'Get user data of logged in user',
  })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Update user data of logged in user',
  })
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userSerice.editUser(userId, dto);
  }

  @ApiOperation({
    summary: 'Change to a new password',
  })
  @Patch('/change-password')
  changePassword(
    @GetUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userSerice.changePassword(userId, dto);
  }
}
