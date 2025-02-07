import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../auth/types';
import { UserService } from 'src/module/user/user.service';
import { UserTokensService } from 'src/module/user-tokens/user-tokens.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService,
    private userService: UserService,
    private tokensService: UserTokensService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('AT_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    
    const checkKeyExist = await this.tokensService.checkKeyStore(payload.sub)
    if(!checkKeyExist){
      Logger.warn("Key not exist",AtStrategy)
      throw new NotFoundException()
    }
    return await this.userService.GetUserWithRole(payload.email)
  }
}


