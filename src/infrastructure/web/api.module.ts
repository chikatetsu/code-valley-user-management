import { Module } from '@nestjs/common';
import { AuthModule } from '@application/auth/auth.module';
import { UserModule } from '@application/user/user.module';
import { FriendshipModule } from '@application/friendship/friendship.module';

@Module({
  imports: [AuthModule, UserModule, FriendshipModule],
})
export class ApiModule {}
