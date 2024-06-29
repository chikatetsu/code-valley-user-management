import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ExecutionResultDto {
  @ApiProperty()
  @IsString()
  output: string;

  @IsString()
  @ApiProperty()
  error: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  outputFile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  outputFileContent?: string;
}
