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
} from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import {
  FriendshipResponseDTO,
  FriendshipDTO,
} from '@application/friendship/dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendshipInterceptor } from './friendship.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { UserQueryDTO } from '@application/user/dto';

@Controller('friendships')
@ApiTags('friendships')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FriendshipInterceptor)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send/:receiverId')
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

  @Post('accept/:friendshipId')
  @ApiParam({ name: 'friendshipId', type: Number })
  @ApiResponse({ status: 201, type: FriendshipResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async acceptFriendRequest(
    @Req() req: any,
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ): Promise<FriendshipResponseDTO> {
    return this.friendshipService.acceptFriendRequest(friendshipId);
  }

  @Post('decline/:friendshipId')
  @ApiParam({ name: 'friendshipId', type: Number })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async declineFriendRequest(
    @Req() req: any,
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ): Promise<void> {
    return this.friendshipService.declineFriendRequest(friendshipId);
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

  @Get('list')
  @ApiResponse({ status: 200, type: [UserQueryDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listFriends(@Req() req: any): Promise<UserQueryDTO[]> {
    const userId = req.user.id;
    return this.friendshipService.listFriends(userId);
  }

  @Get('status')
  @ApiResponse({ status: 200, type: FriendshipDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getFriendshipStatus(
    @Req() req: any,
    @Body('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendshipDTO> {
    const userId = req.user.id;
    return this.friendshipService.getFriendshipStatus(userId, friendId);
  }
}
