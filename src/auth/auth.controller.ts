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
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RegisterDto })
  @Post('register')
  public register(@Body() signInDto: RegisterDto): Promise<TokenResponse> {
    const { email, username, password } = signInDto;
    return this.authService.register(email, username, password);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @Post('login')
  public logIn(@Body() signInDto: LoginDto): Promise<TokenResponse> {
    const { email, password } = signInDto;
    return this.authService.logIn(email, password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
