import { Injectable } from '@nestjs/common';
import { INotificationService } from '@domain/notification/interfaces/notification.service.interface';
import { Notification } from '@domain/notification/entities/notification.entity';
import { NotificationResponseDTO } from '@application/notification/dto/notification.response.dto';
import { NotificationRepository } from '@infra/database/notification.repository';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async getNotifications(userId: number, limit: number): Promise<NotificationResponseDTO[]> {
    const maxLimit = Math.min(limit, 100);
    const notifications = await this.notificationRepository.findManyByUserId(userId, maxLimit);
    return this.toManyResponseDto(notifications);
  }

  async getNotificationCount(userId: number): Promise<number> {
    return await this.notificationRepository.countByUserId(userId);
  }

  async seeNotification(notificationId: number): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepository.findOneById(notificationId);
    notification.hasBeenRead = true;
    const saveResult = await notification.save();
    return this.toResponseDto(saveResult);
  }

  async unseeNotification(notificationId: number): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepository.findOneById(notificationId);
    notification.hasBeenRead = false;
    const saveResult = await notification.save();
    return this.toResponseDto(saveResult);
  }

  async removeNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.deleteOneById(notificationId);
  }

  //Private methods

  private toResponseDto(notification: Notification): NotificationResponseDTO {
    return {
      id: notification.id,
      createdAt: notification.createdAt,
      hasBeenRead: notification.hasBeenRead,
      notificationType: notification.notificationType,
      message: notification.message,
      userId: notification.user.id
    };
  }

  private toManyResponseDto(notifications: Notification[]): NotificationResponseDTO[] {
    let response: NotificationResponseDTO[] = [];
    for (let notification of notifications) {
      response.push(this.toResponseDto(notification));
    }
    return response;
  }
}
