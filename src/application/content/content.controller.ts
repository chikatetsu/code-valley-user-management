import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { ContentDto } from './dto/content.dto';
import { ContentService } from '@domain/content/content.service';

@ApiTags('content')
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
}
