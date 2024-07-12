import { UserModule } from '@application/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@infra/config/config.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@domain/auth/services/auth.service';
import { UserService } from '@domain/user/services/user.service';
import { GoogleStrategy } from '@domain/auth/services/google.strategy';
import { JwtStrategy } from '@domain/auth/services/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserRepository } from '@infra/database/user.repository';
import { User } from '@domain/user/entities/user.entity';
import { Jwt2faStrategy } from '@domain/auth/services/jwt-2fa.strategy';
import { BlacklistService } from '@domain/auth/services/blacklist.service';
import { BlacklistedToken } from '@domain/auth/entities/blacklisted-token.entity';
import { NotFoundInterceptor } from './interceptors/found.interceptor';
import { FirebaseModule } from '@application/firebase/firebase.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register(configService.getJwtConfig()),
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    PassportModule.register({ defaultStrategy: 'google' }),
    FirebaseModule,
  ],
  providers: [
    UserRepository,
    AuthService,
    UserService,
    BlacklistService,
    GoogleStrategy,
    JwtStrategy,
    Jwt2faStrategy,
    NotFoundInterceptor,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
