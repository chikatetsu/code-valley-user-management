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
    example: NotificationType.comment,
    description: 'The type of notification',
  })
  @IsEnum(NotificationType)
  public notificationType: NotificationType;

  @ApiProperty({
    example: 'thierrymaillard has comment your post',
    description: 'The content of the notification',
  })
  @IsString()
  public message: string;

  @ApiProperty({
    example: 1,
    description: 'The id of the user',
  })
  @IsNumber()
  public userId: number;
}
