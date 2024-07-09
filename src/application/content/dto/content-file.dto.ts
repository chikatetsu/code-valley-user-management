import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CodeContentFileDto {
  @ApiProperty()
  @IsNumber({}, { message: 'id must be a number' })
  owner_id: number;

  @ApiProperty()
  @IsString({ message: 'content must be a string' })
  content: string;

  @ApiProperty()
  @IsString({ message: 'filename must be a string' })
  filename: string;

  @ApiProperty()
  @IsString({ message: 'content_type must be a string' })
  content_type: string;

  @ApiProperty()
  @IsNumber({}, { message: 'file_size must be a number' })
  file_size: number;
}

export class ContentFileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
