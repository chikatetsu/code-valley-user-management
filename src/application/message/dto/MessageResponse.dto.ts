import { UserResponseDTO } from '@application/user/dto';
import { GroupResponseDTO } from '@application/group/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MessageResponseDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  value!: string;

  @ApiProperty({ type: () => UserResponseDTO })
  author!: UserResponseDTO;

  @ApiProperty({ type: () => GroupResponseDTO })
  group!: GroupResponseDTO;
}
