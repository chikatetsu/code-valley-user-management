import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { IFriendshipService } from '@domain/friendship/interfaces/friendship.service.interface';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { User } from '@domain/user/entities/user.entity';
import {
  FriendshipDTO,
  FriendshipResponseDTO,
} from '@application/friendship/dto';
import { UserQueryDTO } from '@application/user/dto';
import { FriendshipStatus } from '@application/friendship/types/friendship.status';
import { UserFriendDTO } from '@application/user/dto/UserFriend.dto';

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

    if (
      await this.friendshipRepository.findOne({
        where: { senderId, receiverId, status: FriendshipStatus.pending },
      })
    ) {
      throw new BadRequestException('Friend request already sent');
    }

    const friendship = this.friendshipRepository.create({
      senderId,
      receiverId,
      status: FriendshipStatus.pending,
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
    friendship.status = FriendshipStatus.accepted;
    await this.friendshipRepository.save(friendship);
    return this.toFriendshipResponseDTO(friendship);
  }

  async cancelFriendRequest(senderId: number, receiverId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { senderId, receiverId, status: FriendshipStatus.pending },
    });
    await this.friendshipRepository.delete(friendship.id);
  }

  async declineFriendRequest(friendshipId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOneBy({
      id: friendshipId,
    });
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = FriendshipStatus.declined;
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

  async listFriends(userId: number): Promise<UserFriendDTO[]> {
    const friendships = await this.friendshipRepository.find({
      where: [
        { senderId: userId, status: FriendshipStatus.accepted },
        { receiverId: userId, status: FriendshipStatus.accepted },
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

  async listPendingRequests(userId: number): Promise<UserFriendDTO[]> {
    const friendships = await this.friendshipRepository.find({
      where: { receiverId: userId, status: FriendshipStatus.pending },
      relations: ['sender'],
    });
    return friendships.map((f) => f.sender);
  }

  async listFriendSuggestions(userId: number): Promise<UserFriendDTO[]> {
    const friends = await this.listFriends(userId);
    const friendIds = friends.map((f) => f.id);

    const sentRequests = await this.friendshipRepository.find({
      where: { senderId: userId },
    });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);

    const suggestions = await this.userRepository.find({
      where: {
        id: Not(In([...friendIds, ...sentRequestIds, userId])),
      },
    });

    return suggestions.map((user) => this.toUserFriendDTO(user));
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

  private toUserQueryDTO(user: User): UserQueryDTO {
    return {
      username: user.username,
      email: user.email,
    };
  }

  private toUserFriendDTO(user: User): UserFriendDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
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
