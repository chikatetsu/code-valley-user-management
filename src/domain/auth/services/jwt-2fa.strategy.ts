import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@domain/user/services/user.service';
import { configService } from '@infra/config/config.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret()
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isTwoFactorAuthenticationEnabled && !payload.isTwoFactorAuthenticated) {
      throw new UnauthorizedException('2FA required');
    }

    if(payload.isTwoFactorAuthenticated) {
      throw new UnauthorizedException('2FA already authenticated');
    }
    
    return user;
  }
}