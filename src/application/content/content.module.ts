import { ContentService } from '@domain/content/content.service';
import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ContentController } from './content.controller';

@Module({
  imports: [HttpModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
