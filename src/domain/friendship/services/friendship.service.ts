import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFriendshipService } from '@domain/friendship/interfaces/friendship.service.interface';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { User } from '@domain/user/entities/user.entity';
import {
  FriendshipDTO,
  FriendshipResponseDTO,
} from '@application/friendship/dto';
import { UserQueryDTO } from '@application/user/dto';

@Injectable()
export class FriendshipService implements IFriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendshipResponseDTO> {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const friendship = this.friendshipRepository.create({
      senderId,
      receiverId,
      status: 'pending',
    });
    await this.friendshipRepository.save(friendship);
    return this.toFriendshipResponseDTO(friendship);
  }

  async acceptFriendRequest(
    friendshipId: number,
  ): Promise<FriendshipResponseDTO> {
    const friendship = await this.friendshipRepository.findOneBy({
      id: friendshipId,
    });
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = 'accepted';
    await this.friendshipRepository.save(friendship);
    return this.toFriendshipResponseDTO(friendship);
  }

  async declineFriendRequest(friendshipId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOneBy({
      id: friendshipId,
    });
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = 'declined';
    await this.friendshipRepository.save(friendship);
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    await this.friendshipRepository.delete({
      senderId: userId,
      receiverId: friendId,
    });
    await this.friendshipRepository.delete({
      senderId: friendId,
      receiverId: userId,
    });
  }

  async listFriends(userId: number): Promise<UserQueryDTO[]> {
    const friendships = await this.friendshipRepository.find({
      where: [
        { senderId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' },
      ],
      relations: ['sender', 'receiver'],
    });
    return friendships.map((f) =>
      f.senderId === userId ? f.receiver : f.sender,
    );
  }

  async getFriendshipStatus(
    userId: number,
    friendId: number,
  ): Promise<FriendshipDTO> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    });
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    return this.toFriendshipDTO(friendship);
  }

  private toFriendshipResponseDTO(
    friendship: Friendship,
  ): FriendshipResponseDTO {
    return {
      id: friendship.id,
      senderId: friendship.senderId,
      receiverId: friendship.receiverId,
      status: friendship.status,
      createdAt: friendship.createdAt,
    };
  }

  private toFriendshipDTO(friendship: Friendship): FriendshipDTO {
    return {
      senderId: friendship.senderId,
      receiverId: friendship.receiverId,
      status: friendship.status,
      createdAt: friendship.createdAt,
    };
  }
}
