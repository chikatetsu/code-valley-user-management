import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import {
  FriendshipResponseDTO,
  FriendshipDTO,
} from '@application/friendship/dto';
import { User } from '@domain/user/entities/user.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ExistsInterceptor } from './exists.interceptor';

@Controller('friendships')
@ApiTags('friendships')
@UseInterceptors(ExistsInterceptor)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send/:senderId/:receiverId')
  @ApiParam({ name: 'senderId', type: Number })
  @ApiParam({ name: 'receiverId', type: Number })
  async sendFriendRequest(
    @Param('senderId', ParseIntPipe) senderId: number,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<FriendshipResponseDTO> {
    Logger.log(`sendFriendRequest: senderId=${senderId}, receiverId=${receiverId}`);
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
