import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import {
  FriendshipResponseDTO,
  FriendshipDTO,
  FriendshipSentDTO,
} from '@application/friendship/dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendshipInterceptor } from './interceptors/friendship.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { UserQueryDTO } from '@application/user/dto';
import { UserFriendDTO } from '@application/user/dto/UserFriend.dto';
import { FriendshipPendingDTO } from './dto/FriendshipPending.dto';

@Controller('friendships')
@ApiTags('friendships')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FriendshipInterceptor)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post('send/:receiverId')
  @UseInterceptors(FriendshipInterceptor)
  @ApiParam({ name: 'receiverId', type: Number })
  @ApiResponse({ status: 201, type: FriendshipResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendFriendRequest(
    @Req() req: any,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<FriendshipResponseDTO> {
    const senderId = req.user.id;
    return this.friendshipService.sendFriendRequest(senderId, receiverId);
  }

  @Post('accept/:senderId')
  @ApiParam({ name: 'senderId', type: Number })
  @ApiResponse({ status: 201, type: FriendshipResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async acceptFriendRequest(
    @Req() req: any,
    @Param('senderId', ParseIntPipe) senderId: number,
  ): Promise<FriendshipResponseDTO> {
    const userId = req.user.id;
    return this.friendshipService.acceptFriendRequest(senderId, userId);
  }

  @Post('decline/:friendshipId')
  @ApiParam({ name: 'senderId', type: Number })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async declineFriendRequest(
    @Req() req: any,
    @Param('senderId', ParseIntPipe) senderId: number,
  ): Promise<void> {
    const userId = req.user.id;
    return this.friendshipService.declineFriendRequest(senderId, userId);
  }

  @Delete('remove/:friendId')
  @ApiParam({ name: 'friendId', type: Number })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async removeFriend(
    @Req() req: any,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<void> {
    const userId = req.user.id;
    return this.friendshipService.removeFriend(userId, friendId);
  }

  @Get('requests')
  @ApiResponse({ status: 200, type: [FriendshipPendingDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listPendingRequests(@Req() req: any): Promise<FriendshipPendingDTO[]> {
    const userId = req.user.id;
    return this.friendshipService.listPendingRequests(userId);
  }

  @Get('sent-requests')
  @ApiResponse({ status: 200, type: FriendshipSentDTO, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listSentRequests(@Req() req: any): Promise<FriendshipSentDTO[]> {
    const userId = req.user['id'];
    return this.friendshipService.listSentFriendRequests(userId);
  }

  @Delete('requests/:receiverId')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'receiverId', type: Number })
  async cancelFriendRequest(
    @Req() req: any,
    @Param('receiverId') receiverId: number,
  ): Promise<void> {
    const userId = req.user.id;
    return this.friendshipService.cancelFriendRequest(userId, receiverId);
  }

  @Get('list')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async listFriends(
    @Req() req: any,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('offset', ParseIntPipe) offset: number = 0,
  ): Promise<UserQueryDTO[]> {
    const userId = req.user.id;
    return this.friendshipService.listFriends(userId, limit, offset);
  }

  @Get('list/:userId')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async listFriendsById(
    @Req()
    req: any,
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('offset', ParseIntPipe) offset: number = 0,
  ): Promise<UserFriendDTO[]> {
    return this.friendshipService.listFriends(userId, limit, offset);
  }

  @Get('status')
  @ApiResponse({ status: 200, type: FriendshipDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({
    name: 'friendId',
    required: true,
  })
  @UseInterceptors(FriendshipInterceptor)
  async getFriendshipStatus(
    @Req() req: any,
    @Query('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendshipDTO> {
    const userId = req.user.id;
    return this.friendshipService.getFriendshipStatus(userId, friendId);
  }

  @Get('suggestions')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listFriendSuggestions(@Req() req: any): Promise<UserQueryDTO[]> {
    const userId = req.user.id;
    return this.friendshipService.listFriendSuggestions(userId);
  }

  @Get('following/:currentUserId/:targetUserId')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'currentUserId', type: Number })
  @ApiParam({ name: 'targetUserId', type: Number })
  async isFollowing(
    @Param('currentUserId', ParseIntPipe) currentUserId: number,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<boolean> {
    return this.friendshipService.isFollowing(currentUserId, targetUserId);
  }

  @Get('followers/:userId')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'userId', type: Number })
  async listFollowersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserQueryDTO[]> {
    return this.friendshipService.listFollowers(userId);
  }

  @Get('followings/:userId')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'userId', type: Number })
  async listFollowingsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserQueryDTO[]> {
    return this.friendshipService.listFollowings(userId);
  }
}
