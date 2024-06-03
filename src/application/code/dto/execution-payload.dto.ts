import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExecutionPayloadDto {
  @ApiProperty()
  @IsString()
  language: string;

  @IsString()
  @ApiProperty()
  code: string;
}
