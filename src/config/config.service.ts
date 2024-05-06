import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
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
}

const configService = new ConfigService(process.env).ensureValues([
  'PGHOST',
  'PGPORT',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
  'JWT_EXPIRES',
  'JWT_SECRET',
]);

export { configService };
