import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRt } from 'src/auth/types';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return await this.authService.getUserIfRefreshTokenMatched(payload.sub,refreshToken)
  }
}
