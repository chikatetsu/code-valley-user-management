import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { configService } from '@infra/config/config.service';
import { FileUploadedDto } from '@application/file/dto/file-uploaded.dto';

@Injectable()
export class FileUploadService {
  constructor(private readonly httpService: HttpService) {}

  async uploadFileToMicroservice(
    file: Express.Multer.File,
  ): Promise<FileUploadedDto> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);

      const response = await firstValueFrom(
        this.httpService.post(
          configService.getContentCraftersUrl() + '/v1/content/upload',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }
}
