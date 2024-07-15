import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExecutionPayloadDto {
  @ApiProperty()
  @IsString()
  language: string;

  @IsString()
  @ApiProperty()
  code: string;

  @ApiProperty()
  @IsString()
  output_extension: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  input_file?: any;
}
