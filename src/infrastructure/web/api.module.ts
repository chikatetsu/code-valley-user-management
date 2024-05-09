import { Module } from '@nestjs/common';
import { AuthModule } from 'src/application/auth/auth.module';
import { UserModule } from 'src/application/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
  ],
})
export class ApiModule {}
