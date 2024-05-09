import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../domain/auth/services/auth.service';
import { LoginDto, RegisterDto, TokenResponse } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../domain/user/entities/user.entity';
import { configService } from 'src/infrastructure/config/config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'User successfully registered',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public register(@Body() signInDto: RegisterDto): Promise<TokenResponse> {
    return this.authService.register(signInDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public logIn(@Body() signInDto: LoginDto): Promise<TokenResponse> {
    return this.authService.logIn(signInDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Connected user's information",
    type: User,
  })
  getProfile(@Req() req: any): User {
    return req.user as User;
  }

  @Get('google')
  async googleAuth() {
    const url = await this.authService.getGoogleAuthUrl();
    return { url };
  }
  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User successfully logged in with Google',
    type: TokenResponse,
  })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.loginWithGoogle(req.user);
    const frontendUrl = configService.getFrontendUrl()
    res.redirect(`${frontendUrl}/?token=${jwt.accessToken}`);
  }
}
