import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ example: 'This is a post content' })
  @IsNotEmpty({ message: 'Content must not be empty' })
  content: string;
}