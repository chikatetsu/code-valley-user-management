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

@Injectable()
export class ContentService {
  constructor(private readonly httpService: HttpService) { }

  async uploadFileToMicroservice(
    file: Express.Multer.File,
    owner_id: number,
  ): Promise<FileUploadedDto> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('owner_id', owner_id);

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

  async getContentByOwnerId(owner_id: number): Promise<ContentDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${configService.getContentCraftersUrl()}/v1/content/owner/${owner_id}`,
        ),
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException(`Content with owner_id ${owner_id} not found`);
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
}
