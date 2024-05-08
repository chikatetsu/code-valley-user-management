import { Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
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

export interface ProfileDto {
  id: number;
  email: string;
  username: string;
  lastLoginAt: Date;
  createdAt: Date;
}
