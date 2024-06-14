import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from '@domain/post/services/post.service';
import { JwtAuthGuard } from '@application/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreatePostDto, PostResponseDto, LikePostResponseDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiResponse({ status: 200, type: PostResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPosts(@Req() req: Request): Promise<PostResponseDto[]> {
    const userId = req.user['id'];
    return this.postService.getPosts(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id', type: Number })
  async getPost(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<PostResponseDto> {
    let user = req.user;
    return this.postService.getPostById(id, user.id);
  }

  @Post()
  @ApiResponse({ status: 201, type: PostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        let ext = file.originalname.toLowerCase().split('.').pop();
        if (!RegExp(/(javascript|js|rust|rs|lua|python|py)$/).exec(ext)) {
          callback(
            new BadRequestException(
              `Extension '${ext}' is not allowed, only .js, .rs, .lua, .py`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  async createPost(
    @Req() req: Request,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostResponseDto> {
    const userId = req.user['id'];
    if (!createPostDto.content) {
      throw new BadRequestException('Content must not be empty');
    }

    return this.postService.createPost(userId, createPostDto, file);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'id', type: Number })
  async deletePost(@Param('id') id: number): Promise<void> {
    return this.postService.deletePost(id);
  }

  @Post(':id/like')
  @ApiResponse({ status: 200, type: LikePostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id', type: Number })
  async likePost(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<LikePostResponseDto> {
    const userId = req.user['id'];
    return this.postService.likePost(id, userId);
  }

  @Delete(':id/like')
  @ApiResponse({ status: 200, type: LikePostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id', type: Number })
  async unlikePost(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<LikePostResponseDto> {
    const userId = req.user['id'];
    return this.postService.unlikePost(id, userId);
  }
}
