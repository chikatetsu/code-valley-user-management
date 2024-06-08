import { ApiProperty } from '@nestjs/swagger';

export class FriendshipPendingDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the friendship',
  })
  id: number;
  @ApiProperty({
    example: 1,
    description: 'The id of the sender',
  })
  senderId: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the friendship',
  })
  status: 'pending' | 'accepted' | 'declined';

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
    description: 'The date the friendship was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the sender',
  })
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'The username of the sender',
  })
  username: string;
}
