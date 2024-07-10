import { UserResponseDTO } from '@application/user/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsString()
  avatar?: string;

  @ApiProperty({ type: () => UserResponseDTO, isArray: true })
  members!: UserResponseDTO[];

  @ApiProperty({ type: () => UserResponseDTO, isArray: true })
  admins!: UserResponseDTO[];

  @ApiProperty()
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({ type: () => UserResponseDTO, isArray: true })
  memberJoinRequests!: UserResponseDTO[];
}
