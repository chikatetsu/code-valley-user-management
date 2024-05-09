import { LoginDto, RegisterDto } from './../../../application/auth/dto/auth.dto';
import { TokenResponse } from "src/application/auth/dto/auth.dto";
import { GoogleUser } from "src/interfaces/google-user.interface";

export interface IAuthService {
    register(dto: RegisterDto): Promise<TokenResponse>;
    logIn(dto: LoginDto): Promise<TokenResponse>;
    loginWithGoogle(googleUser: GoogleUser): Promise<TokenResponse>;
    getGoogleAuthUrl(): Promise<string>;
}