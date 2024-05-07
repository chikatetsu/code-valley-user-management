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

export class ProfileDto {
  @ApiProperty()
  @IsNumber()
  public id!: number;

  @ApiProperty()
  @IsString()
  public email!: string;

  @ApiProperty()
  @IsString()
  public username!: string;

  @ApiProperty()
  @IsDate()
  public lastLoginAt: Date;

  @ApiProperty()
  @IsDate()
  public createdAt: Date;

  constructor(
    id: number,
    email: string,
    username: string,
    lastLoginAt: Date,
    createdAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.lastLoginAt = lastLoginAt;
    this.createdAt = createdAt;
  }
}
