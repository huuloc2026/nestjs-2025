import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../../auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.getAuthenticatedUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
