import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entities/notification.entity'

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private readonly dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async createNotification(notification: Notification): Promise<Notification> {
    return this.save(notification);
  }

  async findOneById(id: number): Promise<Notification | null> {
    return this.findOne({
      where: { id: id },
      relations: ['fromUser', 'toUser'],
    });
  }

  async findManyByUserId(id: number, limit: number): Promise<Notification[]> {
    return await this.find({
      where: { toUserId: id },
      take: limit,
      relations: ['fromUser', 'toUser'],
    });
  }

  async countUnseenByUserId(id: number): Promise<number> {
    return this.count({
      where: {
        toUserId: id,
        hasBeenRead: false
      }
    });
  }

  async deleteOneById(id: number): Promise<void> {
    await this.delete({ id: id })
  }
}
