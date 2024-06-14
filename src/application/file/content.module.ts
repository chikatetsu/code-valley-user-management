import { ContentService } from '@domain/content/content.service';
import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule { }
