import { Injectable } from '@nestjs/common';
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

  async createGroup(groupDTO: GroupDTO): Promise<GroupResponseDTO> {
    const members = await this.userRepository.findManyByIds(groupDTO.memberIds);
    const group = await this.groupRepository.createGroup(
      groupDTO.name,
      members,
    );
    return this.toGroupResponseDTO(group);
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

  async removeUserFromGroup(groupId: number, userId: number): Promise<void> {
    await this.groupRepository.removeUserFromGroup(groupId, userId);
  }

  async listGroups(): Promise<GroupResponseDTO[]> {
    const groups = await this.groupRepository.findAll();
    return groups.map(this.toGroupResponseDTO);
  }

  async getGroupDetails(groupId: number): Promise<GroupResponseDTO | null> {
    const group = await this.groupRepository.findOneById(groupId);
    return group ? this.toGroupResponseDTO(group) : null;
  }

  private toGroupResponseDTO = (group: Group): GroupResponseDTO => {
    return {
      id: group.id,
      name: group.name,
      members: group.members.map(this.toUserResponseDTO),
    };
  };

  private toUserResponseDTO = (user: User): UserResponseDTO => {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  };
}
