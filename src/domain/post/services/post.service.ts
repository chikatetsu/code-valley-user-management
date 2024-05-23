import { CreatePostDto, PostResponseDto } from '@application/post/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { UserService } from '@domain/user/services/user.service';
import { PostRepository } from '@infra/database/post.repository';
import { PostLikeRepository } from '@infra/database/post.like.repository';
import { LikePostResponseDto } from '@application/post/dto';
import { ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../entities/post.like.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const post = this.postRepository.create({ ...createPostDto, userId });
    await this.postRepository.save(post);
    return this.toPostResponseDto(post);
  }

  async deletePost(postId: number): Promise<void> {
    await this.postRepository.delete(postId);
  }

  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.findAll();
    return Promise.all(posts.map((post) => this.toPostResponseDto(post)));
  }

  async getPostById(postId: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return this.toPostResponseDto(post);
  }

  async likePost(postId: number, userId: number): Promise<LikePostResponseDto> {
    const post = await this.postRepository.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const like = await this.postLikeRepository.findOne({
      where: { postId, userId },
    });
    if (like) {
      throw new ConflictException('User has already liked this post');
    }

    const postLike = this.postLikeRepository.create({ postId, userId });
    await this.postLikeRepository.save(postLike);

    const likeCount = await this.postLikeRepository.count({
      where: { postId },
    });
    return { id: postId, likes: likeCount };
  }

  async unlikePost(
    postId: number,
    userId: number,
  ): Promise<LikePostResponseDto> {
    const post = await this.postRepository.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const like = await this.postLikeRepository.findOne({
      where: { postId, userId },
    });
    if (!like) {
      throw new NotFoundException('User has not liked this post');
    }

    await this.postLikeRepository.delete(like.id);

    const likeCount = await this.postLikeRepository.count({
      where: { postId },
    });
    return { id: postId, likes: likeCount };
  }

  private async toLikePostResponseDto(
    post: Post,
  ): Promise<LikePostResponseDto> {
    const likeCount = await this.postLikeRepository.count({
      where: { postId: post.id },
    });
    return {
      id: post.id,
      likes: likeCount,
    };
  }
  private async toPostResponseDto(post: Post): Promise<PostResponseDto> {
    const user = await this.userService.findOneById(post.userId);
    const likeCount = await this.postLikeRepository.count({
      where: { postId: post.id },
    });
    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      username: user.username,
      createdAt: post.createdAt,
      avatar: user.avatar,
      likes: likeCount,
    };
  }
}
