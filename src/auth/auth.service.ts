import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { TokenResponse } from './auth.dto';

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

    user = new User();
    user.email = email;
    //user.password = this.helper.encodePassword(password);
    user.password = password;
    user.username = username;
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
    const user = await this.userService.getUser(email);

    if (!user) {
      throw new HttpException(
        'Le mot de passe est incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.password !== password) {
      throw new HttpException(
        'Le mot de passe est incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, username: user.username };
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }
}
