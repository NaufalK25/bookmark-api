import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ParseDTOPipe } from '../common/pipe';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('signup')
  signup(@Args('dto', ParseDTOPipe) dto: any) {
    return this.authService.signup(dto);
  }

  @Mutation('signin')
  signin(@Args('dto', ParseDTOPipe) dto: any) {
    return this.authService.signin(dto);
  }
}
