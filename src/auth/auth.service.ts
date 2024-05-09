import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { TokenResponse } from './auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { configService } from 'src/config/config.service';

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

    const salt = await genSalt();
    const currentDate = new Date();
    const hashedPassword = await hash(password, salt);

    user = new User();
    user.email = email;
    user.password = hashedPassword;
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

    return this.generateToken(user);
  }

  async logIn(email: string, password: string): Promise<TokenResponse> {
    let user = await this.userService.getUser(email);
  
    if (!user) {
      throw new HttpException('Email non trouvé', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordMatching = await compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('Le mot de passe est incorrect', HttpStatus.UNAUTHORIZED);
    }
    
    user = await this.userService.updateLastLoginAt(user.id);
    return this.generateToken(user);
  }
  
  async loginWithGoogle(googleUser: any): Promise<TokenResponse> {
    let user = await this.userService.findOrCreate(googleUser);
    const payload = { email: user.email, sub: user.id };
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }

  async getGoogleAuthUrl(): Promise<string> { 
    const googleConfig = configService.getGoogleConfig();
    const scope = encodeURIComponent('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleConfig.clientId}&redirect_uri=${encodeURIComponent(googleConfig.callbackURL)}&scope=${scope}&access_type=online&prompt=consent`;

    return authUrl;
  }

  private async generateToken(user: User): Promise<TokenResponse> {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }
  
}
