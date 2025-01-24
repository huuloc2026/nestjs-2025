import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AtStrategy, LocalStrategy, RtStrategy } from 'src/common/strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/module/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { UserTokensService } from 'src/module/user-tokens/user-tokens.service';
import { UserTokensModule } from 'src/module/user-tokens/user-tokens.module';


@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
    PassportModule,
    UserTokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
