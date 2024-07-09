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
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { GroupService } from '@domain/group/services/group.service';
import { GroupResponseDTO, GroupDTO } from '@application/group/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
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
  async createGroup(
    @Req() req: any,
    @Body() groupDTO: GroupDTO,
  ): Promise<GroupResponseDTO> {
    return this.groupService.createGroup(groupDTO, Number(req.user.id));
  }

  @Patch('update/:groupId')
  @ApiBody({ type: GroupDTO })
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  async updateGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() updateGroupDTO: GroupDTO,
  ): Promise<GroupResponseDTO> {
    return this.groupService.updateGroup(updateGroupDTO, groupId);
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

  @Post('admin/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async addAdmin(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.addAdmin(groupId, userId);
  }

  @Post('join/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async sendJoinRequest(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.sendJoinRequest(groupId, userId);
  }

  @Post('accept/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async acceptJoinRequest(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GroupResponseDTO> {
    return this.groupService.acceptJoinRequest(groupId, userId);
  }

  @Delete('refuse/:groupId/:userId')
  @ApiResponse({ status: 200, type: GroupResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async refuseJoinRequest(
    @Req() req: any,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    this.groupService.refuseJoinRequest(groupId, userId);
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

  @Get('search/:name')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Search group',
    type: GroupResponseDTO,
  })
  @ApiParam({ name: 'name', type: String })
  async searchProfile(
    @Req() req: any,
    @Param('name') name: string,
  ): Promise<GroupResponseDTO[]> {
    return this.groupService.findManyByName(name);
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
