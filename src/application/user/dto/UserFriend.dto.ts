import { FriendshipStatus } from '@application/friendship/types/friendship.status';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserFriendDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  status: FriendshipStatus;

  @ApiProperty()
  avatar: string;
}
