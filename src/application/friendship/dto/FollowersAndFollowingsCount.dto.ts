import { ApiProperty } from '@nestjs/swagger';

export class FollowersAndFollowingsCountDTO {
  @ApiProperty({
    example: 150,
    description: 'The number of followers',
  })
  followers: number;
  @ApiProperty({
    example: 140,
    description: 'The number of followings',
  })
  followings: number;
}
