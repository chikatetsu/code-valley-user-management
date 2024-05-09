import { UserModule } from "@application/user/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "@infra/config/config.service";
import { PassportModule } from "@nestjs/passport";
import { User } from "@domain/user/entities/user.entity";
import { AuthService } from "@domain/auth/services/auth.service";
import { UserService } from "@domain/user/services/user.service";
import { GoogleStrategy } from "@domain/auth/services/google.strategy";
import { JwtStrategy } from "@domain/auth/services/jwt.strategy";
import { AuthController } from "./auth.controller";



@Module({
  imports: [
    UserModule,
    JwtModule.register(configService.getJwtConfig()),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  providers: [AuthService, UserService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
