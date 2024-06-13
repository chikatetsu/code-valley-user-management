import { Module } from '@nestjs/common';
import { FileUploadService } from '@domain/file/file-upload.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
