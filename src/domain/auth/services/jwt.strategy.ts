import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { configService } from '@infra/config/config.service';
import { UserService } from '@domain/user/services/user.service';
import { User } from '@domain/user/entities/user.entity';
import { IJwtService } from '../interfaces/jwt.service.interface';
import { UserResponseDTO } from '@application/user/dto';


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

  async validate(payload: any) : Promise<UserResponseDTO> {
    const user = await this.userService.findOne(payload.id || payload.sub); 
    if (!user) {
      throw new UnauthorizedException(); 
    }

    return user; 
  }
}
