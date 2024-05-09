import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserBuilder } from '../user/user.entity';
import { TokenResponse } from './auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { configService } from 'src/config/config.service';

const USER_ALREADY_EXISTS_ERROR = 'Cet email ou nom d\'utilisateur est déjà utilisé';
const USER_CREATION_FAILED_ERROR = "Une erreur est survenue lors de la création de l'utilisateur";
const EMAIL_NOT_FOUND_ERROR = 'Email non trouvé';
const PASSWORD_INCORRECT_ERROR = 'Le mot de passe est incorrect';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(email: string, username: string, password: string): Promise<TokenResponse> {
    const user = await this.userService.getUserByUsernameOrEmail(username, email);
    if (user) {
      throw new HttpException(USER_ALREADY_EXISTS_ERROR, HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashPassword(password);
    const currentDate = new Date();
    const newUser = new UserBuilder()
      .withEmail(email)
      .withUsername(username)
      .withPassword(hashedPassword)
      .withCreatedAt(currentDate)
      .withLastLoginAt(currentDate)
      .build();
    const createdUser = await this.userService.createUser(newUser);

    if (!createdUser) {
      throw new HttpException(USER_CREATION_FAILED_ERROR, HttpStatus.UNAUTHORIZED);
    }

    return this.generateToken(newUser);
  }

  async logIn(email: string, password: string): Promise<TokenResponse> {
    let user = await this.userService.getUserByEmail(email);
  
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

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }
  
}
