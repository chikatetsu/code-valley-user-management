import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('PGHOST'),
      port: parseInt(this.getValue('PGPORT')),
      username: this.getValue('PGUSER'),
      password: this.getValue('PGPASSWORD'),
      database: this.getValue('PGDATABASE'),
      entities: [User],
      synchronize: true,
    };
  }

  public getJwtSecret(): string {
    return this.getValue('JWT_SECRET');
  }

  public getJwtConfig(): JwtModuleOptions {
    return {
      global: true,
      secret: this.getValue('JWT_SECRET'),
      signOptions: { expiresIn: this.getValue('JWT_EXPIRES') },
    };
  }

  public getGoogleConfig() {
    return {
      clientId: this.getValue('GOOGLE_CLIENT_ID'),
      clientSecret: this.getValue('GOOGLE_CLIENT_SECRET'),
      callbackURL: `http://localhost:${this.getAppPort()}/auth/google/callback`,
    };
  }

  public getAppPort() {
    return this.getValue('APP_PORT');
  }

  public getFrontendUrl() {
    return this.getValue('FRONTEND_URL');
  }

}

const configService = new ConfigService(process.env).ensureValues([
  'PGHOST',
  'PGPORT',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
  'JWT_EXPIRES',
  'JWT_SECRET',
  'APP_PORT',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FRONTEND_URL',
]);

export { configService };
