import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entities/notification.entity'

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
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

  async countByUserId(id: number): Promise<number> {
    return this.count({
      where: { userId: id }
    });
  }

  async deleteOneById(id: number): Promise<void> {
    await this.delete({ id: id })
  }
}
