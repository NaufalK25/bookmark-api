import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GqlGetUser } from '../auth/decorator';
import { GqlJwtGuard } from '../auth/guard';
import { ParseDTOPipe } from '../common/pipe';
import { UserService } from './user.service';

@UseGuards(GqlJwtGuard)
@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query('getMe')
  getMe(@GqlGetUser() user: User) {
    return user;
  }

  @Mutation('editUser')
  editUser(
    @GqlGetUser('id') userId: number,
    @Args('dto', ParseDTOPipe) dto: any,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Mutation('changePassword')
  changePassword(
    @GqlGetUser('id') userId: number,
    @Args('dto', ParseDTOPipe) dto: any,
  ) {
    return this.userService.changePassword(userId, dto);
  }
}
