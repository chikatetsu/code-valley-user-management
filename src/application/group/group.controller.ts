import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from '@domain/group/services/group.service';
import { GroupResponseDTO, GroupDTO } from '@application/group/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundInterceptor, CreateGroupInterceptor } from './interceptors';

@Controller('groups')
@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(NotFoundInterceptor)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @ApiBody({ type: GroupDTO })
  @ApiResponse({ status: 201, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseInterceptors(CreateGroupInterceptor)
  async createGroup(
    @Req() req: any,
    @Body() groupDTO: GroupDTO,
  ): Promise<GroupResponseDTO> {
    groupDTO.memberIds.push(req.user.id);
    return this.groupService.createGroup(groupDTO);
  }

  @Post('add/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async addUserToGroup(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.addUserToGroup(groupId, userId);
  }

  @Delete('remove/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async removeUserFromGroup(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    this.groupService.removeUserFromGroup(groupId, userId);
  }

  @Get('list')
  @ApiResponse({ status: 200, type: [GroupResponseDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async listGroups(@Req() req: any): Promise<GroupResponseDTO[]> {
    return this.groupService.listGroups();
  }

  @Get('details/:groupId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getGroupDetails(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupResponseDTO | null> {
    return this.groupService.getGroupDetails(groupId);
  }
}
