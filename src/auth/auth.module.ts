import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';


@Module({
  imports: [
    JwtModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
