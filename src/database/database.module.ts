import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/module/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Post } from 'src/module/post/entities/post.entity';
import { Category } from 'src/module/category/entities/category.entity';
import { Order } from 'src/module/order/entities/order.entity';
import { OrderItem } from 'src/module/order-item/entities/order-item.entity';
import { Seller } from 'src/module/seller/entities/seller.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities:[User,Seller,Product,Post,Category,Order,OrderItem],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
