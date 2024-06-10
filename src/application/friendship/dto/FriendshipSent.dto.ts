import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '../types/friendship.status';

export class FriendshipSentDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the friendship',
  })
  id: number;
  @ApiProperty({
    example: 1,
    description: 'The id of the receiver',
  })
  receiverId: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the friendship',
  })
  status: FriendshipStatus;

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
    description: 'The date the friendship was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the receiver',
  })
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'The username of the receiver',
  })
  username: string;
}
