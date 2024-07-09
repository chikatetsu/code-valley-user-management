import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { INotificationService } from '@domain/notification/interfaces/notification.service.interface';
import { Notification } from '@domain/notification/entities/notification.entity';
import { NotificationResponseDTO } from '@application/notification/dto/notification.response.dto';
import { NotificationRepository } from '@infra/database/notification.repository';
import { NotificationCountDTO } from '@application/notification/dto/notification.count.dto';
import { NotificationType } from '@domain/notification/types/notification.type';
import { FriendshipService } from '@domain/friendship/services/friendship.service';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    @Inject(forwardRef(() => FriendshipService)) private friendShipService: FriendshipService,
  ) {}

  async getNotifications(userId: number, limit: number = 100): Promise<NotificationResponseDTO[]> {
    const maxLimit = Math.min(limit, 100);
    const notifications = await this.notificationRepository.findManyByUserId(userId, maxLimit);
    return this.toManyResponseDto(notifications);
  }

  async getNotificationCount(userId: number): Promise<NotificationCountDTO> {
    const countValue = await this.notificationRepository.countUnseenByUserId(userId);
    return this.toCountDto(countValue);
  }

  async seeNotification(notificationId: number): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepository.findOneById(notificationId);
    if (notification == null) {
      return null;
    }
    notification.hasBeenRead = true;
    const saveResult = await notification.save();
    return this.toResponseDto(saveResult);
  }

  async unseeNotification(notificationId: number): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepository.findOneById(notificationId);
    if (notification == null) {
      return null;
    }
    notification.hasBeenRead = false;
    const saveResult = await notification.save();
    return this.toResponseDto(saveResult);
  }

  async removeNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.deleteOneById(notificationId);
  }

  async notifyFollowers(notificationType: NotificationType, fromUserId: number, linkId: number = null): Promise<void> {
    const followers = await this.friendShipService.listFollowers(fromUserId)
    followers.forEach(followers => {
      this.notifyUser(notificationType, fromUserId, followers.id, linkId);
    });
  }

  async notifyUser(notificationType: NotificationType, fromUserId: number, receiverId: number, linkId: number = null): Promise<void> {
    const notification = new Notification(notificationType, fromUserId, receiverId, linkId);
    await this.notificationRepository.createNotification(notification);
  }

  //Private methods

  private toResponseDto(notification: Notification): NotificationResponseDTO {
    return {
      id: notification.id,
      createdAt: notification.createdAt,
      hasBeenRead: notification.hasBeenRead,
      notificationType: notification.notificationType,
      fromUsername: notification.fromUser.username,
      fromUserId: notification.fromUserId,
      linkId: notification.linkId,
    };
  }

  private toManyResponseDto(notifications: Notification[]): NotificationResponseDTO[] {
    let response: NotificationResponseDTO[] = [];
    for (let notification of notifications) {
      response.push(this.toResponseDto(notification));
    }
    return response;
  }

  private toCountDto(value: number): NotificationCountDTO {
    return {
      count: value
    }
  }
}
