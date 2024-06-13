import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  fileId: string;

  @ApiProperty()
  code_url?: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  userHasLiked: boolean;
}
