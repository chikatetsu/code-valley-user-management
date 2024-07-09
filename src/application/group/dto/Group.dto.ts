import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmpty, IsString } from 'class-validator';

export class GroupDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsBoolean()
  isPublic!: boolean;
}
