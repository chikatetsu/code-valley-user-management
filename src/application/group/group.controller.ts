import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from '@domain/group/services/group.service';
import { GroupResponseDTO, GroupDTO } from '@application/group/dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  async createGroup(@Body() groupDTO: GroupDTO): Promise<GroupResponseDTO> {
    return this.groupService.createGroup(groupDTO);
  }

  @Post('add/:groupId')
  async addUserToGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.addUserToGroup(groupId, userId);
  }

  @Delete('remove/:groupId/:userId')
  async removeUserFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.removeUserFromGroup(groupId, userId);
  }

  @Get('list')
  async listGroups(): Promise<GroupResponseDTO[]> {
    return this.groupService.listGroups();
  }

  @Get('details/:groupId')
  async getGroupDetails(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupResponseDTO | null> {
    return this.groupService.getGroupDetails(groupId);
  }
}
