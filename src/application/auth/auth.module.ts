import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { configService } from "src/infrastructure/config/config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/domain/user/entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "src/domain/auth/services/auth.service";
import { UserService } from "src/domain/user/services/user.service";
import { GoogleStrategy } from "src/domain/auth/services/google.strategy";
import { JwtStrategy } from "src/domain/auth/services/jwt.strategy";
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
