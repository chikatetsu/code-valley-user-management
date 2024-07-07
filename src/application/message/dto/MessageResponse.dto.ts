import { UserResponseDTO } from '@application/user/dto';
import { GroupResponseDTO } from '@application/group/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsDate()
  createdAt!: Date;
}
