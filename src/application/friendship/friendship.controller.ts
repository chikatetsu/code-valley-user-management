import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import {
  FriendshipResponseDTO,
  FriendshipDTO,
} from '@application/friendship/dto';
import { User } from '@domain/user/entities/user.entity';

@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send')
  async sendFriendRequest(
    @Body('senderId', ParseIntPipe) senderId: number,
    @Body('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<FriendshipResponseDTO> {
    return this.friendshipService.sendFriendRequest(senderId, receiverId);
  }

  @Post('accept/:friendshipId')
  async acceptFriendRequest(
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ): Promise<FriendshipResponseDTO> {
    return this.friendshipService.acceptFriendRequest(friendshipId);
  }

  @Post('decline/:friendshipId')
  async declineFriendRequest(
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ): Promise<void> {
    return this.friendshipService.declineFriendRequest(friendshipId);
  }

  @Delete('remove')
  async removeFriend(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('friendId', ParseIntPipe) friendId: number,
  ): Promise<void> {
    return this.friendshipService.removeFriend(userId, friendId);
  }

  @Get('list/:userId')
  async listFriends(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User[]> {
    return this.friendshipService.listFriends(userId);
  }

  @Get('status')
  async getFriendshipStatus(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendshipDTO> {
    return this.friendshipService.getFriendshipStatus(userId, friendId);
  }
}
