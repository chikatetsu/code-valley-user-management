import { Post } from '@domain/post/entities/post.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }
  async findAll(): Promise<Post[]> {
    return this.find();
  }

  async findOneById(id: number): Promise<Post | null> {
    return this.findOneBy({ id: id });
  }
}
