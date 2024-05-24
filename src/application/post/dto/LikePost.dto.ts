import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LikePostDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  postId: number;
}
