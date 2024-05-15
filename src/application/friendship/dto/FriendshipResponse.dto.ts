export class FriendshipResponseDTO {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}
