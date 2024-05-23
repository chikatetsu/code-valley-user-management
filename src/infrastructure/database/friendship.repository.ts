import { DataSource, Repository } from 'typeorm';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { Injectable } from '@nestjs/common';
import { FriendshipStatus } from '@application/friendship/types/friendship.status';

@Injectable()
export class FriendshipRepository extends Repository<Friendship> {
  constructor(private dataSource: DataSource) {
    super(Friendship, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<Friendship | null> {
    return this.findOneBy({ id: id });
  }

  async findAll(): Promise<Friendship[]> {
    return this.find();
  }

  async createFriendship(
    senderId: number,
    receiverId: number,
  ): Promise<Friendship> {
    const friendship = this.create({
      senderId,
      receiverId,
      status: FriendshipStatus.pending,
      createdAt: new Date(),
    });
    return this.save(friendship);
  }

  async updateStatus(
    friendshipId: number,
    status: FriendshipStatus,
  ): Promise<Friendship> {
    const friendship = await this.findOneById(friendshipId);
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = status;
    return this.save(friendship);
  }

  async removeFriendship(friendshipId: number): Promise<void> {
    await this.delete(friendshipId);
  }

  async findFriendshipsByUserId(userId: number): Promise<Friendship[]> {
    return this.createQueryBuilder('friendship')
      .where(
        'friendship.senderId = :userId OR friendship.receiverId = :userId',
        { userId },
      )
      .andWhere('friendship.status = :status', { status: 'accepted' })
      .getMany();
  }

  async findPendingRequests(userId: number): Promise<Friendship[]> {
    return this.createQueryBuilder('friendship')
      .where('friendship.receiverId = :userId', { userId })
      .andWhere('friendship.status = :status', { status: 'pending' })
      .getMany();
  }
}
