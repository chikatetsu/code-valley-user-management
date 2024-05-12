import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@domain/auth/services/auth.service';
import { LoginDto, RegisterDto, TfCodeAuthDto, TokenResponse } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';
import { configService } from '@infra/config/config.service';
import { UserService } from '@domain/user/services/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

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
  public logIn(@Body() signInDto: LoginDto): Promise<TokenResponse | { status: number, message: string }> {
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

  @Post('2fa/turn-on')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  async turnOnTwoFactorAuthentication(@Req() request) {
    if (request.user.isTwoFactorAuthenticationEnabled) {
      throw new UnauthorizedException('Two-factor authentication is already enabled');
    }
    await this.userService.changeStateTwoFactorAuthentication(request.user.id, true);
  }

  @Post('2fa/turn-off')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  async turnOffTwoFactorAuthentication(@Req() request) {
    if (!request.user.isTwoFactorAuthenticationEnabled) {
      throw new UnauthorizedException('Two-factor authentication is already disabled');
    }
    await this.userService.changeStateTwoFactorAuthentication(request.user.id, false);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  @ApiBody({ type: TfCodeAuthDto })
  async authenticate(@Req() request, @Body() body) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(request.user);
  }

  @Post('2fa/generate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  async registerGenerate(@Res() response, @Req() request) {
    if (request.user.isTwoFactorAuthenticationEnabled) {
      throw new UnauthorizedException('Two-factor authentication is already enabled, please turn it off first');
    }
    
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return response.json(
      await this.authService.generateQrCodeDataURL(otpauthUrl),
    );
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
