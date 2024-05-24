import { PostLike } from '@domain/post/entities/post.like.entity';
import { Post } from '@domain/post/entities/post.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostLikeRepository extends Repository<PostLike> {
  constructor(private dataSource: DataSource) {
    super(PostLike, dataSource.createEntityManager());
  }

  async findAll(): Promise<PostLike[]> {
    return this.find();
  }
}
