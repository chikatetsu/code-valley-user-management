import { NotificationResponseDTO } from '@application/notification/dto/notification.response.dto';
import { NotificationCountDTO } from '@application/notification/dto/notification.count.dto';
import { NotificationType } from '@domain/notification/types/notification.type';

export interface INotificationService {
  getNotifications(
    userId: number,
    limit: number,
  ): Promise<NotificationResponseDTO[]>;
  getNotificationCount(userId: number): Promise<NotificationCountDTO>;
  seeNotification(notificationId: number): Promise<NotificationResponseDTO>;
  unseeNotification(notificationId: number): Promise<NotificationResponseDTO>;
  removeNotification(notificationId: number): Promise<void>;
  notifyFollowers(
    notificationType: NotificationType,
    fromUserId: number,
    senderId: number,
  ): Promise<void>;
  notifyUser(
    notificationType: NotificationType,
    fromUserId: number,
    receiverId: number,
  ): Promise<void>;
}
