import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { configService } from '../config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Aucun token renseigné', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: configService.getJwtSecret(),
      });
      request['user'] = payload;
    } catch {
      throw new HttpException('Token invalide', HttpStatus.CONFLICT);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) {
      return undefined;
    }

    const [type, token] = request.headers.authorization.split(' ') ?? [];

    if (type?.toLowerCase() !== 'bearer') {
      throw new HttpException(
        "Type d'authorisation invalide",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return token;
  }
}
