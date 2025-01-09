import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({isGlobal:true}), 
    DatabaseModule, PostModule, CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
