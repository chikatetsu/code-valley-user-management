import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokenResponse } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public register(@Body() signInDto: RegisterDto): Promise<TokenResponse> {
    const { email, username, password } = signInDto;
    return this.authService.register(email, username, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public logIn(@Body() signInDto: LoginDto): Promise<TokenResponse> {
    const { email, password } = signInDto;
    return this.authService.logIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
