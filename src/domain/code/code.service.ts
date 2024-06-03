import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionPayloadDto, ExecutionResultDto } from '@application/code/dto';
import { configService } from '@infra/config/config.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CodeService {
  constructor(private readonly httpService: HttpService) {}

  async executeCode(payload: ExecutionPayloadDto): Promise<ExecutionResultDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          configService.getDynoCodeUrl() + '/execute',
          payload,
        ),
      );
      return response.data;
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
