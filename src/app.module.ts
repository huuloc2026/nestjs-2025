import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
}) ,
    CommonModule,
    AuthModule, 
    PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
