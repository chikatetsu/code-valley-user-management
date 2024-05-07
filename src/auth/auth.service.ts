import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { ProfileDto, TokenResponse } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(
    email: string,
    username: string,
    password: string,
  ): Promise<TokenResponse> {
    let user: User = await this.userService.getUser(email);

    if (user) {
      throw new HttpException(
        'Cet email est déjà utilisé',
        HttpStatus.CONFLICT,
      );
    }

    const currentDate = new Date();
    user = new User();
    user.email = email;
    user.password = await this.encodePassword(password);
    user.username = username;
    user.createdAt = currentDate;
    user.lastLoginAt = currentDate;
    const createdUser: User = await this.userService.createUser(user);
    if (!createdUser) {
      throw new HttpException(
        "Une erreur est survenue lors de la création de l'utilisateur",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: createdUser.id, username: createdUser.username };
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }

  async logIn(email: string, password: string): Promise<TokenResponse> {
    let user = await this.userService.getUser(email);

    if (!user) {
      throw new HttpException(
        'Le mot de passe est incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isSamePassword = await this.isPasswordValid(user.password, password);
    if (!isSamePassword) {
      throw new HttpException(
        'Le mot de passe est incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    user = await this.userService.updateLastLoginAt(user.id);
    const payload = new ProfileDto(
      user.id,
      user.email,
      user.username,
      user.lastLoginAt,
      user.createdAt,
    );
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }

  /** Encode User's password */
  private async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /** Validate User's password */
  public isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(userPassword, password);
  }
}
