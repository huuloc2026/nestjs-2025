import { Module } from '@nestjs/common';


import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { SellerModule } from './module/seller/seller.module';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';

import { OrderItemModule } from './module/order-item/order-item.module';
import { UserModule } from 'src/module/user/user.module';
import { PostModule } from 'src/module/post/post.module';
import { OrderModule } from 'src/module/order/order.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [UserModule,
    DatabaseModule, PostModule, CommonModule, AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    RedisModule,
    SellerModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    MailerModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
