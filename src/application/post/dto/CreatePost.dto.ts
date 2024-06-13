import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'This is a post content' })
  @IsNotEmpty({ message: 'Content must not be empty' })
  content: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
