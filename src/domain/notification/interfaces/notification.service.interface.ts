import { NotificationResponseDTO } from '@application/notification/dto/notification.response.dto';

export interface INotificationService {
  getNotifications(userId: number, limit: number): Promise<NotificationResponseDTO[]>;
  getNotificationCount(userId: number): Promise<number>;
  seeNotification(notificationId: number): Promise<NotificationResponseDTO>;
  unseeNotification(notificationId: number): Promise<NotificationResponseDTO>;
  removeNotification(notificationId: number): Promise<void>;
}
