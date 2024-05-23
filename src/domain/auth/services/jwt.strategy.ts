import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { configService } from '@infra/config/config.service';
import { UserService } from '@domain/user/services/user.service';
import { IJwtService } from '../interfaces/jwt.service.interface';
import { BlacklistService } from './blacklist.service';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements IJwtService
{
  constructor(
    private userService: UserService,
    private blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    payload: any,
    done: (error: any, user: any) => void,
  ): Promise<any> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const isBlacklisted = await this.blacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return done(new UnauthorizedException('Token is blacklisted'), false);
    }

    const user = await this.userService.findOne({
      id: payload.sub || payload.id,
    });

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    if (
      user.isTwoFactorAuthenticationEnabled &&
      !payload.isTwoFactorAuthenticated
    ) {
      return done(
        new UnauthorizedException('2FA authentication required'),
        false,
      );
    }
    return done(null, user);
  }
}
