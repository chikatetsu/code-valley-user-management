export class RegisterDto {
  email: string;
  username: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class TokenResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
