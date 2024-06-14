import { Module } from '@nestjs/common';
import { AuthModule } from '@application/auth/auth.module';
import { UserModule } from '@application/user/user.module';
import { FriendshipModule } from '@application/friendship/friendship.module';
import { GroupModule } from '@application/group/group.module';
import { PostModule } from '@application/post/post.module';
import { FirebaseModule } from '@application/firebase/firebase.module';
import { CodeModule } from '@application/code/code.module';
//import { ContentModule } from '@application/file/content.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FriendshipModule,
    GroupModule,
    /*ContentModule,*/
    PostModule,
    FirebaseModule,
    CodeModule,
  ],
})
export class ApiModule {}
