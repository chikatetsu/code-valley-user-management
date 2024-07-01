import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { IFriendshipService } from '@domain/friendship/interfaces/friendship.service.interface';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { User } from '@domain/user/entities/user.entity';
import {
  FriendshipDTO,
  FriendshipResponseDTO,
  FriendshipSentDTO,
} from '@application/friendship/dto';
import { UserQueryDTO } from '@application/user/dto';
import { FriendshipStatus } from '@application/friendship/types/friendship.status';
import { UserFriendDTO } from '@application/user/dto/UserFriend.dto';
import { FriendshipPendingDTO } from '@application/friendship/dto/FriendshipPending.dto';
import { NotificationService } from '@domain/notification/services/notification.service';
import { NotificationType } from '@domain/notification/types/notification.type';

@Injectable()
export class FriendshipService implements IFriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService
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
    await this.notificationService.notifyUser(NotificationType.friendshipReceived, senderId, receiverId);
    return this.toFriendshipResponseDTO(friendship);
  }

  async acceptFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendshipResponseDTO> {
    const friendship = await this.friendshipRepository.findOne({
      where: { senderId, receiverId, status: FriendshipStatus.pending },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = FriendshipStatus.accepted;
    await this.friendshipRepository.save(friendship);
    await this.notificationService.notifyUser(NotificationType.friendshipAccepted, receiverId, senderId);
    return this.toFriendshipResponseDTO(friendship);
  }

  async cancelFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { senderId, receiverId, status: FriendshipStatus.pending },
    });
    await this.friendshipRepository.delete(friendship.id);
  }

  async declineFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<void> {
    const friendship = await this.friendshipRepository.findOneBy({
      senderId,
      receiverId,
      status: FriendshipStatus.pending,
    });
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = FriendshipStatus.declined;
    await this.friendshipRepository.save(friendship);
    await this.notificationService.notifyUser(NotificationType.friendshipRefused, receiverId, senderId);
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

  /**
   * Retrieves a list of friends for a given user.
   *
   * @param userId - The ID of the user.
   * @param limit - The maximum number of friends to retrieve.
   * @param offset - The number of friends to skip before retrieving.
   * @returns A promise that resolves to an array of UserFriendDTO objects representing the user's friends.
   */
  async listFriends(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserFriendDTO[]> {
    const maxLimit = Math.min(limit, 100);
    const friendships = await this.friendshipRepository.find({
      where: [
        { senderId: userId, status: FriendshipStatus.accepted },
        { receiverId: userId, status: FriendshipStatus.accepted },
      ],
      relations: ['sender', 'receiver'],
      take: maxLimit,
      skip: offset,
    });
    return friendships
      .map((f) => (f.senderId === userId ? f.receiver : f.sender))
      .map((user) => this.toUserFriendDTO(user, FriendshipStatus.accepted));
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

  async listPendingRequests(userId: number): Promise<FriendshipPendingDTO[]> {
    const friendships = await this.friendshipRepository.find({
      where: { receiverId: userId, status: FriendshipStatus.pending },
      relations: ['sender', 'receiver'],
    });
    return friendships.map((f) => ({
      id: f.id,
      senderId: f.sender.id,
      status: f.status,
      createdAt: f.createdAt,
      email: f.sender.email,
      username: f.sender.username,
    }));
  }

  async listSentFriendRequests(userId: number): Promise<FriendshipSentDTO[]> {
    const sentRequests = await this.friendshipRepository.find({
      where: { senderId: userId, status: FriendshipStatus.pending },
      relations: ['receiver'],
    });
    return sentRequests.map((req) => ({
      id: req.id,
      receiverId: req.receiver.id,
      status: req.status,
      createdAt: req.createdAt,
      email: req.receiver.email,
      username: req.receiver.username,
    }));
  }
  async listFriendSuggestions(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserFriendDTO[]> {
    const friends = await this.listFriends(userId, 1000, 0);
    const friendIds = friends.map((f) => f.id);

    const sentRequests = await this.friendshipRepository.find({
      where: { senderId: userId },
    });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);

    const suggestions = await this.userRepository.find({
      where: {
        id: Not(In([...friendIds, ...sentRequestIds, userId])),
      },
      take: limit,
      skip: offset,
    });

    return suggestions.map((user) =>
      this.toUserFriendDTO(user, FriendshipStatus.none),
    );
  }

  async isFollowing(
    currentUserId: number,
    targetUserId: number,
  ): Promise<boolean> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { senderId: currentUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: currentUserId },
      ],
    });
    return (
      friendship?.status === FriendshipStatus.pending ||
      friendship?.status === FriendshipStatus.accepted
    );
  }

  async listFollowers(
    userId: number,
    limit: number = 100,
    offset: number = 0,
  ): Promise<UserFriendDTO[]> {
    const friendships = await this.friendshipRepository.find({
      where: {
        receiverId: userId,
        status: In([FriendshipStatus.accepted, FriendshipStatus.pending]),
      },
      relations: ['sender'],
      take: limit,
      skip: offset,
    });

    friendships.push(
      ...(await this.friendshipRepository.find({
        where: {
          senderId: userId,
          status: FriendshipStatus.accepted,
        },
        relations: ['receiver'],
        take: limit,
        skip: offset,
      })),
    );
    return friendships.map((f) =>
      this.toUserFriendDTO(
        f.senderId === userId ? f.receiver : f.sender,
        f.status,
      ),
    );
  }

  async listFollowings(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserFriendDTO[]> {
    const maxLimit = Math.min(limit, 100);
    const friendships = await this.friendshipRepository.find({
      where: {
        senderId: userId,
        status: In([FriendshipStatus.accepted, FriendshipStatus.pending]),
      },
      relations: ['receiver'],
      take: maxLimit,
      skip: offset,
    });

    friendships.push(
      ...(await this.friendshipRepository.find({
        where: {
          receiverId: userId,
          status: FriendshipStatus.accepted,
        },
        relations: ['sender'],
        take: maxLimit,
        skip: offset,
      })),
    );

    return friendships.map((f) =>
      this.toUserFriendDTO(
        f.receiverId === userId ? f.sender : f.receiver,
        f.status,
      ),
    );
  }

  async getFollowersAndFollowingsCount(
    userId: number,
  ): Promise<{ followers: number; followings: number }> {
    let followersCount = await this.friendshipRepository.count({
      where: {
        receiverId: userId,
        status: In([FriendshipStatus.accepted, FriendshipStatus.pending]),
      },
    });

    followersCount += await this.friendshipRepository.count({
      where: {
        senderId: userId,
        status: FriendshipStatus.accepted,
      },
    });

    let followingsCount = await this.friendshipRepository.count({
      where: {
        senderId: userId,
        status: In([FriendshipStatus.accepted, FriendshipStatus.pending]),
      },
      relations: ['receiver'],
    });

    followingsCount += await this.friendshipRepository.count({
      where: {
        receiverId: userId,
        status: FriendshipStatus.accepted,
      },
    });

    return { followers: followersCount, followings: followingsCount };
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

  private toUserFriendDTO(user: User, status: FriendshipStatus): UserFriendDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      status: status,
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
