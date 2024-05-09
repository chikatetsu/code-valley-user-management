
import { LoginDto, RegisterDto, TokenResponse } from "@application/auth/dto/auth.dto";
import { GoogleUser } from "interfaces/google-user.interface";

export interface IAuthService {
    register(dto: RegisterDto): Promise<TokenResponse>;
    logIn(dto: LoginDto): Promise<TokenResponse>;
    loginWithGoogle(googleUser: GoogleUser): Promise<TokenResponse>;
    getGoogleAuthUrl(): Promise<string>;
}