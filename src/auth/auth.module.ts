import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { UsersService } from 'src/users/users.service';


@Module({
  imports: [
    
    JwtModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [UsersService,AuthService],
})
export class AuthModule {}
