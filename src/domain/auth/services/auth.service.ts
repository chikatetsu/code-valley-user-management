import { IAuthService } from '../interfaces/auth.service.interface';
import { RegisterDto , LoginDto, TokenResponse } from '@application/auth/dto/auth.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@domain/user/services/user.service';
import { JwtService } from '@nestjs/jwt';

import { compare, genSalt, hash } from 'bcrypt';
import { configService } from '@infra/config/config.service';
import { User, UserBuilder } from '@domain/user/entities/user.entity';
import { GoogleUser } from 'interfaces/google-user.interface';

const USER_ALREADY_EXISTS_ERROR = 'Cet email ou nom d\'utilisateur est déjà utilisé';
const USER_CREATION_FAILED_ERROR = "Une erreur est survenue lors de la création de l'utilisateur";
const EMAIL_NOT_FOUND_ERROR = 'Email non trouvé';
const PASSWORD_INCORRECT_ERROR = 'Le mot de passe est incorrect';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDto): Promise<TokenResponse> {
    const user = await this.userService.getUserByUsernameOrEmail({ email: dto.email, username: dto.username });
    if (user) {
      throw new HttpException(USER_ALREADY_EXISTS_ERROR, HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashPassword(dto.password);
    const currentDate = new Date();
    const newUser = new UserBuilder()
      .withEmail(dto.email)
      .withUsername(dto.username)
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

  async logIn(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.userService.getUserByEmail({ email: dto.email });
    if (!user) {
      throw new HttpException(EMAIL_NOT_FOUND_ERROR, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await compare(dto.password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(PASSWORD_INCORRECT_ERROR, HttpStatus.UNAUTHORIZED);
    }
    
    await this.userService.updateLastLoginAt({ id: user.id });
    return this.generateToken(user);
  }
  
  async loginWithGoogle(googleUser: GoogleUser): Promise<TokenResponse> {
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
