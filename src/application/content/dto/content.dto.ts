import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ContentDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  code_url: string;

  @ApiProperty()
  @IsString()
  content_type: string;

  @ApiProperty()
  @IsString()
  file_hash: string;

  @ApiProperty()
  @IsString()
  file_path: string;

  @ApiProperty()
  @IsNumber()
  file_size: number;

  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  owner_id: string;

  @ApiProperty()
  @IsString()
  update_time: string;

  @ApiProperty()
  @IsString()
  upload_time: string;
}
