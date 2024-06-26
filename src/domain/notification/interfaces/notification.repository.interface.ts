import { Notification } from '../entities/notification.entity';
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  SaveOptions,
} from 'typeorm';

export interface INotificationRepository {
  findAll(): Promise<Notification[]>;
  findOne(options: FindOneOptions<Notification>): Promise<Notification | null>;
  findOneBy(criteria: Record<string, any>): Promise<Notification | null>;
  delete(criteria: Record<string, any>): Promise<DeleteResult>;
  save(
    friendship: DeepPartial<Notification> | DeepPartial<Notification>[],
    options?: SaveOptions,
  ): Promise<Notification | Notification[]>;
}
