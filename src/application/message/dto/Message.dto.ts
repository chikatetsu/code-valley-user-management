import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDTO {
  @ApiProperty()
  @IsString()
  value!: string;

  @ApiProperty()
  @IsString({ each: true })
  authorId!: string;

  @ApiProperty()
  @IsString({ each: true })
  groupId!: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
