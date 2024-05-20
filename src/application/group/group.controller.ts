import { Controller, Post, Param, Body, Delete, Get, ParseIntPipe, UseGuards, Req, Logger, UseInterceptors } from '@nestjs/common';
import { GroupService } from '@domain/group/services/group.service';
import { GroupResponseDTO, GroupDTO } from '@application/group/dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GroupInterceptor } from './group.interceptor';

@Controller('groups')
@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(GroupInterceptor)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  
  @Post('create')
  @ApiBody({ type: GroupDTO })
  @ApiResponse({ status: 201, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createGroup(@Req() req: any, @Body() groupDTO: GroupDTO): Promise<GroupResponseDTO> {
    return this.groupService.createGroup(groupDTO);
  }

  @Post('add/:groupId')
  async addUserToGroup(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupResponseDTO> {
    const userId = req.user.id;
    return this.groupService.addUserToGroup(groupId, userId);
  }

  @Delete('remove/:groupId/:userId')
  async removeUserFromGroup(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.removeUserFromGroup(groupId, userId);
  }

  @Get('list')
  async listGroups(@Req() req: any): Promise<GroupResponseDTO[]> {
    return this.groupService.listGroups();
  }

  @Get('details/:groupId')
  async getGroupDetails(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupResponseDTO | null> {
    return this.groupService.getGroupDetails(groupId);
  }
}
