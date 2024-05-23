import { CreatePostDto, PostResponseDto } from '@application/post/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = this.postRepository.create({ ...createPostDto, userId });
    await this.postRepository.save(post);
    return this.toPostResponseDto(post);
  }

  async deletePost(postId: number): Promise<void> {
    await this.postRepository.delete(postId);
  }

  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find();
    return posts.map(this.toPostResponseDto);
  }

  private toPostResponseDto(post: Post): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      createdAt: post.createdAt,
    };
  }
}
