import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post.like.entity';
import {
  CommentResponseDto,
  CreateCommentDto,
  CreatePostDto,
  LikePostResponseDto,
  PostResponseDto,
} from '@application/post/dto';
import { UserService } from '@domain/user/services/user.service';
import { PostRepository } from '@infra/database/post.repository';
import { ContentService } from '@domain/content/content.service';
import { NotificationService } from '@domain/notification/services/notification.service';
import { NotificationType } from '@domain/notification/types/notification.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly notificationService: NotificationService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<PostResponseDto> {
    let fileId: string | null = null;
    let code_url: string | null = null;
    if (file) {
      const fileResponse = await this.contentService.uploadFileToMicroservice(
        file,
        userId,
        createPostDto.output_extension,
      );
      [fileId, code_url] = [fileResponse.id, fileResponse.code_url];
    }
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      fileId,
    });
    await this.postRepository.save(post);
    await this.notificationService.notifyFollowers(
      NotificationType.post,
      userId,
      post.id,
    );
    return this.toPostResponseDto(post, userId, code_url, '.txt');
  }

  async deletePost(postId: number): Promise<void> {
    await this.postRepository.delete(postId);
  }

  async getPosts(
    currentUserId: number,
    limit: number,
    offset: number,
  ): Promise<PostResponseDto[]> {
    const maxLimit = Math.min(limit, 100);
    const posts = await this.postRepository.find({
      take: maxLimit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        if (post.fileId) {
          const content = await this.contentService.getContentById(post.fileId);
          return this.toPostResponseDto(
            post,
            currentUserId,
            content.code_url,
            content.output_type,
          );
        }
        return this.toPostResponseDto(post, currentUserId, null);
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
    return this.toPostResponseDto(post, currentUserId, null);
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
    await this.notificationService.notifyUser(
      NotificationType.like,
      userId,
      post.userId,
      postId,
    );
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
    codeUrl: string,
    outputType: string = '.txt',
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
      output_type: outputType,
      username: user.username,
      createdAt: post.createdAt,
      avatar: user.avatar,
      likes: likeCount,
      userHasLiked: !!userHasLiked,
    };
  }

  async createComment(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const user = await this.userService.findOneUserById(userId);
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.user = user;
    comment.post = post;

    await this.commentRepository.save(comment);

    return {
      id: comment.id,
      content: comment.content,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      postId: post.id,
      createdAt: comment.createdAt,
    };
  }

  async getCommentsByPostId(
    postId: number,
    limit: number,
    offset: number,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      relations: ['user', 'post'],
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user.id,
      username: comment.user.username,
      avatar: comment.user.avatar,
      postId: comment.post.id,
      createdAt: comment.createdAt,
    }));
  }

  async deleteComment(
    userId: number,
    postId: number,
    commentId: number,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId } },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new ConflictException('User is not the author of the comment');
    }

    await this.commentRepository.delete(commentId);
  }

  private sortPostsByDate(posts: Post[]): Post[] {
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
