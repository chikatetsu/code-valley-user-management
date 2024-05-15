import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { User } from '@domain/user/entities/user.entity';
import {
  FriendshipDTO,
  FriendshipResponseDTO,
} from '@application/friendship/dto';

export interface IFriendshipService {
  sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendshipResponseDTO>;
  acceptFriendRequest(friendshipId: number): Promise<FriendshipResponseDTO>;
  declineFriendRequest(friendshipId: number): Promise<void>;
  removeFriend(userId: number, friendId: number): Promise<void>;
  listFriends(userId: number): Promise<User[]>;
  getFriendshipStatus(userId: number, friendId: number): Promise<FriendshipDTO>;
}
