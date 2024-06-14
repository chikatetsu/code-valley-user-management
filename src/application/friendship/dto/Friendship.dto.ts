import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '../types/friendship.status';

export class FriendshipDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the friendship',
  })
  senderId: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the receiver',
  })
  receiverId: number;

  @ApiProperty({
    example: 'accepted',
    description: 'The status of the friendship',
  })
  status: FriendshipStatus;

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
    description: 'The date the friendship was created',
  })
  createdAt: Date;
}
