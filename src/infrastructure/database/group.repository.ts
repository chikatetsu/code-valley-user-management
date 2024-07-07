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

  async createGroup(
    name: string,
    description: string,
    isPublic: boolean,
    user: User,
  ): Promise<Group> {
    const group = this.create({
      name,
      description,
      isPublic,
      members: [],
    });
    group.members.push(user);
    return await this.save(group);
  }

  async addUserToGroup(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members.push(user);
    return await this.save(group);
  }

  async sendJoinRequest(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.memberJoinRequests.push(user);
    return await this.save(group);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members = group.members.filter((member) => member.id !== userId);
    return await this.save(group);
  }

  async findAll(): Promise<Group[]> {
    return await this.find({ relations: ['members', 'memberJoinRequests'] });
  }

  async findOneById(id: number): Promise<Group | null> {
    return await this.findOne({
      where: { id },
      relations: ['members', 'memberJoinRequests'],
    });
  }

  async findManyByName(name: string): Promise<Group[] | null> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.memberJoinRequests', 'memberJoinRequest')
      .leftJoinAndSelect('group.members', 'member')
      .where('LOWER(group.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .orderBy('group.name', 'ASC')
      .getMany();
  }
}
