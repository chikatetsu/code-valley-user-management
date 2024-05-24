import { DataSource, Repository } from 'typeorm';
import { Group } from '@domain/group/entities/group.entity';
import { Injectable } from '@nestjs/common';
import { IGroupRepository } from '@domain/group/interfaces/group.repository.interface';
import { User } from '@domain/user/entities/user.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async createGroup(name: string, members: User[]): Promise<Group> {
    const group = this.create({ name, members });
    return await this.save(group);
  }

  async addUserToGroup(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members.push(user);
    return await this.save(group);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members = group.members.filter((member) => member.id !== userId);
    return await this.save(group);
  }

  async findAll(): Promise<Group[]> {
    return await this.find({ relations: ['members'] });
  }

  async findOneById(id: number): Promise<Group | null> {
    return await this.findOne({
      where: { id },
      relations: ['members'],
    });
  }
}
