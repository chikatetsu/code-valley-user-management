import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { configService } from '@infra/config/config.service';
import { FileUploadedDto } from '@application/content/dto/file-uploaded.dto';
import { ContentDto } from '@application/content/dto/content.dto';
import { CodeContentFileDto } from '@application/content/dto/content-file.dto';

@Injectable()
export class ContentService {
  constructor(private readonly httpService: HttpService) {}

  async uploadFileToMicroservice(
    file: Express.Multer.File,
    owner_id: number,
    output_extension: string,
  ): Promise<FileUploadedDto> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('owner_id', owner_id);
      formData.append('output_extension', output_extension ?? 'txt');

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

  async uploadFileToGroup(
    file: Express.Multer.File,
    owner_id: number,
    group_id: number,
  ): Promise<FileUploadedDto> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('owner_id', owner_id);
      formData.append('group_id', group_id);
      const response = await firstValueFrom(
        this.httpService.post(
          configService.getContentCraftersUrl() + '/v1/group/upload',
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

  async uploadFileForMessage(
    file: Express.Multer.File,
    owner_id: number,
    group_id: number,
    message_id: number,
  ): Promise<FileUploadedDto> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('owner_id', owner_id);
      formData.append('group_id', group_id);
      formData.append('message_id', message_id);
      const response = await firstValueFrom(
        this.httpService.post(
          configService.getContentCraftersUrl() + '/v1/group/upload',
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

  async codeContentToMultersFile(
    content: CodeContentFileDto,
  ): Promise<Express.Multer.File> {
    const buffer = Buffer.from(content.content, 'base64');

    const multerFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: content.filename,
      encoding: '7bit',
      mimetype: content.content_type,
      size: content.file_size,
      buffer,
      stream: null,
      destination: '',
      filename: content.filename,
      path: '',
    };

    return multerFile;
  }

  async getContentById(id: string): Promise<ContentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${configService.getContentCraftersUrl()}/v1/content/${id}`,
        ),
      );

      if (!response.data) {
        throw new NotFoundException(`Content with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
  }

  async getContentsByOwnerId(owner_id: number): Promise<ContentDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${configService.getContentCraftersUrl()}/v1/content/owner/${owner_id}`,
        ),
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException(
        `Content with owner_id ${owner_id} not found`,
      );
    }
  }

  async deleteContentById(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${configService.getContentCraftersUrl()}/v1/content/${id}`,
        ),
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException(`Failed to delete content with id ${id}`);
    }
  }

  /** TO IMPROVE BECAUSE NO TESTED */

  async updateContentById(id: string, updateData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${configService.getContentCraftersUrl()}/v1/content/${id}`,
          updateData,
        ),
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException(`Failed to update content with id ${id}`);
    }
  }
}
