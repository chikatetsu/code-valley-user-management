import {
  Controller,
  Param,
  Delete,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
  Post,
  Req, BadRequestException, NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from '@domain/notification/services/notification.service';
import { NotificationResponseDTO } from '@application/notification/dto/notification.response.dto';
import { NotificationCountDTO } from '@application/notification/dto/notification.count.dto';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  @ApiOkResponse({ type: [NotificationResponseDTO], description: 'List of all notifications' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'limit', required: false })
  async getNotifications(@Req() request, @Query('limit') limit?: string): Promise<NotificationResponseDTO[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    if (isNaN(parsedLimit)) {
      throw new BadRequestException('Limit must be a number');
    }
    return await this.notificationService.getNotifications(request.user.id, parsedLimit);
  }

  @Get('count')
  @ApiOkResponse({ type: NotificationCountDTO, description: 'The number of notification that hasn\'t been seen' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getNotificationCount(@Req() request): Promise<NotificationCountDTO> {
    return await this.notificationService.getNotificationCount(request.user.id);
  }

  @Post('see/:notificationId')
  @ApiOkResponse({ description: 'Notification has been seen successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'notificationId', type: Number })
  async seeNotification(@Param('notificationId', ParseIntPipe) notificationId: number): Promise<NotificationResponseDTO> {
    const response = await this.notificationService.seeNotification(notificationId);
    if (response == null) {
      throw new NotFoundException('Notification with id ' + notificationId + ' does not exist');
    }
    return response;
  }

  @Post('unsee/:notificationId')
  @ApiOkResponse({ description: 'Notification has been unseen successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'notificationId', type: Number })
  async unseeNotification(@Param('notificationId', ParseIntPipe) notificationId: number): Promise<NotificationResponseDTO> {
    const response = await this.notificationService.unseeNotification(notificationId);
    if (response == null) {
      throw new NotFoundException('Notification with id ' + notificationId + ' does not exist');
    }
    return response;
  }

  @Delete(':notificationId')
  @ApiOkResponse({ description: 'Notification has been deleted successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'notificationId', type: Number })
  async removeNotification(@Param('notificationId') notificationId: number): Promise<void> {
    await this.notificationService.removeNotification(notificationId);
  }
}
