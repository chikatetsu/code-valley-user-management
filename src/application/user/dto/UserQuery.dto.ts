import { ApiProperty } from '@nestjs/swagger';

export class UserQueryDTO {
  @ApiProperty({
    example: 'username',
    description: 'The username of the user',
  })
  username?: string;

  @ApiProperty({
    example: 'username@gmail.com',
    description: 'The email of the user',
  })
  email?: string;
}
