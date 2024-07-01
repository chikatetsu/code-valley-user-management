import {
  FriendshipDTO,
  FriendshipResponseDTO,
} from '@application/friendship/dto';
import { UserQueryDTO } from '@application/user/dto';

export interface IFriendshipService {
  sendFriendRequest(
    senderId: number,
    senderUsername: string,
    receiverId: number,
  ): Promise<FriendshipResponseDTO>;
  acceptFriendRequest(
    senderId: number,
    senderUsername: string,
    receiverId: number,
  ): Promise<FriendshipResponseDTO>;
  declineFriendRequest(senderId: number, senderUsername: string, receiverId: number): Promise<void>;
  removeFriend(userId: number, friendId: number): Promise<void>;
  listFriends(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserQueryDTO[]>;
  getFriendshipStatus(userId: number, friendId: number): Promise<FriendshipDTO>;
}
