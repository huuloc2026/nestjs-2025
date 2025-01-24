import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from 'src/module/user-tokens/user-tokens.entity';
import { UserTokensService } from 'src/module/user-tokens/user-tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [UserTokensService],
  exports: [UserTokensService,TypeOrmModule],
})
export class UserTokensModule {}
