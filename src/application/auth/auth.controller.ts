import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '@domain/auth/services/auth.service';
import {
  LoginDto,
  RegisterDto,
  TfCodeAuthDto,
  TokenResponse,
} from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';
import { configService } from '@infra/config/config.service';
import { UserService } from '@domain/user/services/user.service';
import { UserResponseDTO } from '@application/user/dto';
import { NotFoundInterceptor } from './interceptors/found.interceptor';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'User successfully registered',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public register(@Body() signInDto: RegisterDto): Promise<TokenResponse> {
    return this.authService.register(signInDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public logIn(
    @Body() signInDto: LoginDto,
  ): Promise<TokenResponse | { status: number; message: string }> {
    return this.authService.logIn(signInDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User successfully logged out',
  })
  async logout(@Req() req, @Res() res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logout(token);
    res.json();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Connected user's information",
    type: User,
  })
  getMe(@Req() req: any): User {
    return req.user as User;
  }

  @Get('profile/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User profile',
    type: UserResponseDTO,
  })
  @ApiParam({ name: 'id', type: Number })
  async getProfile(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<UserResponseDTO> {
    return this.userService.findOneById(id);
  }

  @Get('google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Google authentication URL',
  })
  async googleAuth() {
    const url = await this.authService.getGoogleAuthUrl();
    return { url };
  }

  @Post('2fa/turn-on')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'Two-factor authentication successfully enabled',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async turnOnTwoFactorAuthentication(@Req() request) {
    if (request.user.isTwoFactorAuthenticationEnabled) {
      throw new UnauthorizedException(
        'Two-factor authentication is already enabled',
      );
    }
    await this.userService.changeStateTwoFactorAuthentication(
      request.user.id,
      true,
    );
  }

  @Post('2fa/turn-off')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  @ApiOkResponse({
    description: 'Two-factor authentication successfully disabled',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async turnOffTwoFactorAuthentication(@Req() request) {
    if (request.user.isTwoFactorAuthenticationEnabled === false) {
      throw new UnauthorizedException(
        'Two-factor authentication is already disabled',
      );
    }
    await this.userService.changeStateTwoFactorAuthentication(
      request.user.id,
      false,
    );
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-2fa'))
  @ApiBody({ type: TfCodeAuthDto })
  @ApiOkResponse({
    description: 'Two-factor authentication successfully enabled',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'QR code generated successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async registerGenerate(@Res() response, @Req() request) {
    if (request.user.isTwoFactorAuthenticationEnabled) {
      if (
        request.user.isTwoFactorAuthenticationEnabled &&
        request.user.twoFactorAuthenticationSecret
      ) {
        throw new UnauthorizedException(
          'Two-factor authentication is already enabled, please turn it off first',
        );
      }

      const { secret, otpauthUrl } =
        await this.authService.generateTwoFactorAuthenticationSecret(
          request.user,
        );

      const qrCodeUrl =
        await this.authService.generateQrCodeDataURL(otpauthUrl);
      return response.json({ qrCodeUrl, setupKey: secret });
    }

    throw new ForbiddenException(
      'Two-factor authentication is disable, please turn it on first',
    );
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User successfully logged in with Google',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.loginWithGoogle(req.user);
    const frontendUrl = configService.getFrontendUrl();
    res.redirect(`${frontendUrl}/?token=${jwt.accessToken}`);
  }

  @Post('avatar')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!RegExp(/\/(jpg|jpeg|png)$/).exec(file.mimetype)) {
          callback(new BadRequestException('Unsupported file type'), false);
        }
        callback(null, true);
      },
    }),
  )
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Avatar uploaded successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size === 0) {
      throw new BadRequestException('File is empty');
    }
    const avatarUrl = await this.userService.uploadAvatar(userId, file);
    return { avatarUrl };
  }
}
