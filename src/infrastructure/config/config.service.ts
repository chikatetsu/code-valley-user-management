import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
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
      entities: ['dist/**/*.entity{.ts,.js}'],
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

  public async getGoogleConfig() {
    const app_hostname = await this.getValue('APP_HOSTNAME');
    const url = `${app_hostname}/auth/google/callback`;
    return {
      clientId: this.getValue('GOOGLE_CLIENT_ID'),
      clientSecret: this.getValue('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${url}`,
    };
  }

  public getGoogleCloudConfig() {
    return {
      projectId: this.getValue('GOOGLE_CLOUD_PROJECT_ID'),
      keyFilename: this.getValue('GOOGLE_CLOUD_KEY_FILE'),
      bucketName: this.getValue('GOOGLE_CLOUD_BUCKET_NAME'),
    };
  }

  public getFirebaseConfig() {
    return {
      storageBucket: this.getValue('FIREBASE_STORAGE_BUCKET'),
      firebasePrivateKeyBase64: this.getValue('FIREBASE_PRIVATE_KEY_BASE64'),
    };
  }

  public getAppPort() {
    return this.getValue('APP_PORT');
  }

  public getAppHostname() {
    return this.getValue('APP_HOSTNAME');
  }

  public getFrontendUrl() {
    return this.getValue('FRONTEND_URL');
  }

  public getDynoCodeUrl() {
    return this.getValue('DYNO_CODE_URL');
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
  'DYNO_CODE_URL',
]);

export { configService };
