import { Module } from '@nestjs/common';
import { AuthModule } from '@application/auth/auth.module';
import { UserModule } from '@application/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class ApiModule {}
