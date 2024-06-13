import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostLike } from '../entities/post.like.entity';
import {
  CreatePostDto,
  PostResponseDto,
  LikePostResponseDto,
} from '@application/post/dto';
import { UserService } from '@domain/user/services/user.service';
import { PostRepository } from '@infra/database/post.repository';
import { ObjectId } from 'mongodb';
import { ContentService } from '@domain/content/content.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<PostResponseDto> {
    let fileId: string | null = null;
    let code_url: string | null = null;
    if (file) {
      const fileResponse =
        await this.contentService.uploadFileToMicroservice(file);
      [fileId, code_url] = [fileResponse.id, fileResponse.code_url];

      if (!ObjectId.isValid(fileId)) {
        throw new BadRequestException('File id is not valid');
      }
    }
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      fileId,
    });
    await this.postRepository.save(post);
    return this.toPostResponseDto(post, userId, code_url);
  }

  async deletePost(postId: number): Promise<void> {
    await this.postRepository.delete(postId);
  }

  async getPosts(currentUserId: number): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.findAll();

    return Promise.all(
      posts.map(async (post) => {
        if (post.fileId) {
          const content = await this.contentService.getContentById(post.fileId);
          return this.toPostResponseDto(post, currentUserId, content.code_url);
        }
        return this.toPostResponseDto(post, currentUserId);
      }),
    );
  }

  async getPostById(
    postId: number,
    currentUserId: number,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.fileId) {
      const content = await this.contentService.getContentById(post.fileId);
      return this.toPostResponseDto(post, currentUserId, content.code_url);
    }
    return this.toPostResponseDto(post, currentUserId);
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

  private async toPostResponseDto(
    post: Post,
    currentUserId: number,
    codeUrl?: string,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findOneById(post.userId);
    const likeCount = await this.postLikeRepository.count({
      where: { postId: post.id },
    });

    const userHasLiked = await this.postLikeRepository.findOne({
      where: { postId: post.id, userId: currentUserId },
    });

    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      fileId: post.fileId,
      code_url: codeUrl,
      username: user.username,
      createdAt: post.createdAt,
      avatar: user.avatar,
      likes: likeCount,
      userHasLiked: !!userHasLiked,
    };
  }
}
