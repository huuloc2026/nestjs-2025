import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/module/user-tokens/user-tokens.entity';

import { Repository } from 'typeorm';

@Injectable()
export class UserTokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async storeToken(userId: string, accessToken: string, refreshToken: string) {
    await this.tokenRepository.delete({ userId });
    await this.tokenRepository.save({
      userId,
      accessToken,
      refreshToken,
    });
    Logger.log(`Token saved for userId: ${userId}`, 'UserTokensService');
  }

  async checkKeyStore(userId:string){
    return await this.tokenRepository.findOne({where:{
      userId
    }})
  }
  async revokeToken(userId: string) {
    await this.tokenRepository.update({ userId }, { isRevoked: true });
  }

  async validateAccessToken(userId: string, accessToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { userId, isRevoked: false },
    });
    if (!token) {
      return false;
    }
    return token && token.accessToken === accessToken;
  }
  
  async validateRefreshToken(userId: string, refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { userId, isRevoked: false },
    });
    if (!token) {
      return false;
    }
    return token && token.refreshToken === refreshToken;
  }

  async removeToken(userId: string): Promise<any> {
    return await this.tokenRepository.delete({ userId });
  }
}
