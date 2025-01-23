import { Module } from '@nestjs/common';

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
import { MailModule } from './mailer/mailer.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from 'src/common/guards';
import { AtStrategy, RtStrategy } from 'src/common/strategies';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DatabaseModule,
    PostModule,
    CommonModule,
    AuthModule,
    RedisModule,
    SellerModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    AtStrategy,
    RtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
