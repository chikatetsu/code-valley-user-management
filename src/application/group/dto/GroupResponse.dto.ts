import { UserResponseDTO } from '@application/user/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GroupResponseDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({ type: () => UserResponseDTO, isArray: true })
  members!: UserResponseDTO[];
}
