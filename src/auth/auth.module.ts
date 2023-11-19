import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, AuthResolver],
  controllers: [AuthController],
})
export class AuthModule {}
