import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentDto } from './dto/content.dto';
import { ContentService } from '@domain/content/content.service';
import { CodeContentFileDto, ContentFileDto } from './dto/content-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostResponseDto } from '@application/post/dto';
import { JwtAuthGuard } from '@application/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('owner/:owner_id')
  @ApiParam({ name: 'owner_id', type: Number })
  @ApiOkResponse({
    description: 'Content',
    type: [ContentDto],
  })
  async getContent(@Param('owner_id') owner_id: number): Promise<ContentDto[]> {
    return this.contentService.getContentsByOwnerId(owner_id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Content',
    type: ContentDto,
  })
  async getContentById(@Param('id') id: string): Promise<ContentDto> {
    return this.contentService.getContentById(id);
  }

  @Post('upload')
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
  @ApiBody({ type: ContentFileDto })
  async uploadProgram(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ContentDto> {
    const userId = req.user['id'];
    let file_uploaded = await this.contentService.uploadFileToMicroservice(
      file,
      userId,
    );
    return this.contentService.getContentById(file_uploaded.id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Deleted' })
  async deleteContent(@Param('id') id: string): Promise<void> {
    await this.contentService.deleteContentById(id);
  }
}
