import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AtStrategy, RtStrategy } from 'src/auth/strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/module/user/user.module';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
    PassportModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [],
})
export class AuthModule {}
