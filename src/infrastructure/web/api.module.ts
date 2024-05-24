import { Module } from '@nestjs/common';
import { AuthModule } from '@application/auth/auth.module';
import { UserModule } from '@application/user/user.module';
import { FriendshipModule } from '@application/friendship/friendship.module';
import { GroupModule } from '@application/group/group.module';
import { PostModule } from '@application/post/post.module';
import { FirebaseModule } from '@application/firebase/firebase.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FriendshipModule,
    GroupModule,
    PostModule,
    FirebaseModule,
  ],
})
export class ApiModule {}
