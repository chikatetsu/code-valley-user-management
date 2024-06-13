import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';

export class UserSearchDTO {
  @ApiProperty({
    description: 'List of corresponding users',
  })
  users?: User[];
}