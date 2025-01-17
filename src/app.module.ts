import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [UserModule,
    DatabaseModule, PostModule, CommonModule, AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    RedisModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
