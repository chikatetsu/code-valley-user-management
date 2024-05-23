import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@domain/post/entities/post.entity';
import { PostRepository } from '@infra/database/post.repository';
import { PostService } from '@domain/post/services/post.service';
import { PostController } from './post.controller';
import { UserService } from '@domain/user/services/user.service';
import { User } from '@domain/user/entities/user.entity';
import { UserRepository } from '@infra/database/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    PostService,
    UserService,
    UserRepository,
    PostRepository,
  ],
})
export class PostModule {}
