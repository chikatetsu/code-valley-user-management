import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@domain/post/entities/post.entity';
import { PostRepository } from '@infra/database/post.repository';
import { PostService } from '@domain/post/services/post.service';
import { PostController } from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostRepository,

  ],
})
export class PostModule {}
