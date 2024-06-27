import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entities/notification.entity'
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { FriendshipStatus } from '@application/friendship/types/friendship.status';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async createNotification(notification: Notification): Promise<Notification> {
    return this.save(notification);
  }

  async findOneById(id: number): Promise<Notification | null> {
    return this.findOneBy({ id: id });
  }

  async findManyByUserId(id: number, limit: number): Promise<Notification[]> {
    return await this.find({
      where: { userId: id },
      take: limit,
    });
  }

  async countUnseenByUserId(id: number): Promise<number> {
    return this.count({
      where: {
        userId: id,
        hasBeenRead: false
      }
    });
  }

  async deleteOneById(id: number): Promise<void> {
    await this.delete({ id: id })
  }
}
