import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { configService } from '@infra/config/config.service';
import { UserService } from '@domain/user/services/user.service';
import { User } from '@domain/user/entities/user.entity';
import { IJwtService } from '../interfaces/jwt.service.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) implements IJwtService {
    constructor(
        private userService: UserService 
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret()
    });
  }

  async validate(payload: any) : Promise<User> {
    const user = await this.userService.findOne({ id: payload.sub||payload.id });
  
    if (!user) {
      throw new UnauthorizedException(); 
    }

    if (user.isTwoFactorAuthenticationEnabled && !payload.isTwoFactorAuthenticated) {
      throw new UnauthorizedException("2FA authentication required");
    }

    return user;
  }
}
