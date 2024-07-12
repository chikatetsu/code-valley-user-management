import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class NotificationCountDTO {
  @ApiProperty({
    example: 1,
    description: 'The number of notification that hasn\'t been seen by the user',
  })
  @IsNumber()
  public count: number;
}