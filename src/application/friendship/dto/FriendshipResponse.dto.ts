import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { FriendshipStatus } from '../types/friendship.status';

export class FriendshipResponseDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the friendship',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the sender',
  })
  @IsNumber()
  senderId: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the receiver',
  })
  @IsNumber()
  receiverId: number;

  @ApiProperty({
    example: 'accepted',
    description: 'The status of the friendship',
  })
  @IsString()
  status: FriendshipStatus;

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
    description: 'The date the friendship was created',
  })
  @IsDate()
  createdAt: Date;
}
