import {
  FriendshipDTO,
  FriendshipResponseDTO,
} from '@application/friendship/dto';
import { UserQueryDTO } from '@application/user/dto';

export interface IFriendshipService {
  sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendshipResponseDTO>;
  acceptFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendshipResponseDTO>;
  declineFriendRequest(senderId: number, receiverId: number): Promise<void>;
  removeFriend(userId: number, friendId: number): Promise<void>;
  listFriends(userId: number): Promise<UserQueryDTO[]>;
  getFriendshipStatus(userId: number, friendId: number): Promise<FriendshipDTO>;
}
