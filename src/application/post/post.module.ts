import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@domain/post/entities/post.entity';
import { PostRepository } from '@infra/database/post.repository';
import { PostService } from '@domain/post/services/post.service';
import { PostController } from './post.controller';
import { UserService } from '@domain/user/services/user.service';
import { UserRepository } from '@infra/database/user.repository';
import { PostLike } from '@domain/post/entities/post.like.entity';
import { PostLikeRepository } from '@infra/database/post.like.repository';
import { FirebaseModule } from '@application/firebase/firebase.module';
import { ContentModule } from '@application/content/content.module';
import { NotificationModule } from '@application/notification/notification.module';

@Module({
  imports: [
    ContentModule,
    TypeOrmModule.forFeature([Post, PostLike]),
    FirebaseModule,
    NotificationModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    UserService,
    UserRepository,
    PostRepository,
    PostLikeRepository,
  ],
})
export class PostModule {}
