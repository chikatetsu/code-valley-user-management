import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @ApiProperty(
    {
      example: 'ricardo.juez@gmail.com',
    },
  )
  @IsEmail()
  email: string;

  @ApiProperty(
    {
      example: 'carlito0605',
    },
  )
  @IsString()
  username: string;

  @ApiProperty( {
    description: 'min 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol',
    example: 'Password123!',
  })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'password too weak (min 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol)',
    },
  )
  password: string;
}

export class LoginDto {
  @ApiProperty(
    {
      example: 'ricardo.juez@gmail.com',
    },
  )
  @IsEmail()
  email: string;

  @ApiProperty(
    {
      example: 'Password123!',
    },
  )
  @IsString()
  password: string;
}

export class TokenResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class TfCodeAuthDto {
  @ApiProperty()
  @IsString()
  twoFactorAuthenticationCode: string;
}

export interface ProfileDto {
  id: number;
  email: string;
  username: string;
  lastLoginAt: Date;
  createdAt: Date;
}
