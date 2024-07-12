import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { NotificationType } from '@domain/notification/types/notification.type';

export class NotificationResponseDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the notification',
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
    description: 'The date the notification was created',
  })
  @IsDate()
  public createdAt: Date;

  @ApiProperty({
    example: false,
    description: 'Is the notification has been read',
  })
  @IsBoolean()
  public hasBeenRead: boolean;

  @ApiProperty({
    example: 'thierrymaillard91',
    description: 'The username of the user',
  })
  @IsString()
  public fromUsername: string;

  @ApiProperty({
    example: "1",
    description: 'The id of the user',
  })
  @IsNumber()
  public fromUserId: number;

  @ApiProperty({
    example: NotificationType.like,
    description: 'The type of notification',
  })
  @IsEnum(NotificationType)
  public notificationType: NotificationType;

  @ApiProperty({
    example: 1,
    description: 'The id of the post or comment linked to the notification',
  })
  @IsNumber()
  public linkId: number;
}
