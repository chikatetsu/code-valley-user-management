import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Votre commentaire ne peut pas être vide' })
  content: string;
}
