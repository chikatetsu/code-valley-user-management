import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ExecutionPayloadDto, ExecutionResultDto } from '@application/code/dto';
import { configService } from '@infra/config/config.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class CodeService {
  constructor(private readonly httpService: HttpService) {}

  async executeCode(payload: ExecutionPayloadDto): Promise<ExecutionResultDto> {
    try {
      const form = new FormData();
      form.append('language', payload.language);
      form.append('code', payload.code);
      form.append('output_extension', payload.output_extension);

      if (payload.input_file) {
        form.append(
          'input_file',
          payload.input_file.buffer,
          payload.input_file.originalname,
        );
      }

      const response = await firstValueFrom(
        this.httpService.post(
          configService.getDynoCodeUrl() + '/execute',
          form,
          {
            headers: form.getHeaders(),
            responseType: 'json',
          },
        ),
      );

      const responseData = response.data;
      const result: ExecutionResultDto = {
        output: responseData.output,
        error: responseData.error,
        outputFile: responseData.output_file_path || null,
        outputFileContent: responseData.output_file_content || null,
      };

      return result;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          {
            status: error.response.status,
            error: error.response.data,
          },
          error.response.status,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An unexpected error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
