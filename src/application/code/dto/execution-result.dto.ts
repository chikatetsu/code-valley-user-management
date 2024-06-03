import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExecutionResultDto {
  @ApiProperty()
  @IsString()
  output: string;

  @IsString()
  @ApiProperty()
  error: string;
}
