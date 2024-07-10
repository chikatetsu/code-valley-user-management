import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '@domain/group/entities/group.entity';
import { GroupDTO, GroupResponseDTO } from '@application/group/dto';
import { User } from '@domain/user/entities/user.entity';
import { UserResponseDTO } from '@application/user/dto';
import { IGroupService } from '@domain/group/interfaces/group.service.interface';
import { GroupRepository } from '@infra/database/group.repository';
import { UserRepository } from '@infra/database/user.repository';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createGroup(
    groupDTO: GroupDTO,
    userId: number,
  ): Promise<GroupResponseDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const group = await this.groupRepository.createGroup(
      groupDTO.name,
      groupDTO.description,
      groupDTO.isPublic,
      user,
    );
    return this.toGroupResponseDTO(group);
  }

  async updateGroup(
    updateGroupDTO: GroupDTO,
    groupId: number,
  ): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findOneById(groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    Object.assign(group, updateGroupDTO);
    return this.toGroupResponseDTO(await this.groupRepository.save(group));
  }

  async addUserToGroup(
    groupId: number,
    userId: number,
  ): Promise<GroupResponseDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const group = await this.groupRepository.addUserToGroup(groupId, user);
    return this.toGroupResponseDTO(group);
  }

  async addAdmin(groupId: number, userId: number): Promise<GroupResponseDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const group = await this.groupRepository.addAdmin(groupId, user);
    return this.toGroupResponseDTO(group);
  }

  async sendJoinRequest(
    groupId: number,
    userId: number,
  ): Promise<GroupResponseDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const group = await this.groupRepository.sendJoinRequest(groupId, user);
    return this.toGroupResponseDTO(group);
  }

  async acceptJoinRequest(
    groupId: number,
    userId: number,
  ): Promise<GroupResponseDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const group = await this.groupRepository.acceptJoinRequest(groupId, user);
    return this.toGroupResponseDTO(group);
  }

  async refuseJoinRequest(groupId: number, userId: number): Promise<void> {
    await this.groupRepository.refuseJoinRequest(groupId, userId);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<void> {
    await this.groupRepository.removeUserFromGroup(groupId, userId);
  }

  async listGroups(): Promise<GroupResponseDTO[]> {
    const groups = await this.groupRepository.findAll();
    return groups.map(this.toGroupResponseDTO);
  }

  async findManyByName(name: string): Promise<GroupResponseDTO[]> {
    const groups = await this.groupRepository.findManyByName(name);
    return this.toManyResponseDto(groups);
  }

  async getGroupDetails(groupId: number): Promise<GroupResponseDTO | null> {
    const group = await this.groupRepository.findOneById(groupId);
    return group ? this.toGroupResponseDTO(group) : null;
  }

  private toGroupResponseDTO = (group: Group): GroupResponseDTO => {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members ? group.members.map(this.toUserResponseDTO) : [],
      admins: group.admins ? group.admins.map(this.toUserResponseDTO) : [],
      isPublic: group.isPublic,
      memberJoinRequests: group.memberJoinRequests
        ? group.memberJoinRequests.map(this.toUserResponseDTO)
        : [],
    };
  };

  private toUserResponseDTO = (user: User): UserResponseDTO => {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      avatar: user.avatar,
    };
  };

  private toManyResponseDto(groups: Group[]): GroupResponseDTO[] {
    let response: GroupResponseDTO[] = [];
    for (let group of groups) {
      response.push(this.toGroupResponseDTO(group));
    }
    return response;
  }
}
