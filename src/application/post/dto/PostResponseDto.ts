import { ApiProperty } from "@nestjs/swagger";

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;
}