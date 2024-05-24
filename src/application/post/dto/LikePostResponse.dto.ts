import { ApiProperty } from '@nestjs/swagger';

export class LikePostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  likes: number;
}
