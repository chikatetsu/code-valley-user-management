import { CreatePostDto, PostResponseDto } from '@application/post/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { UserService } from '@domain/user/services/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
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
    return Promise.all(posts.map((post) => this.toPostResponseDto(post)));
  }

  private async toPostResponseDto(post: Post): Promise<PostResponseDto> {
    let user = await this.userService.findOneById(post.userId);
    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      username: user.username,
      createdAt: post.createdAt,
    };
  }
}
