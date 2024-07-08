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
      admins: [],
    });
    group.members.push(user);
    group.admins.push(user);
    return await this.save(group);
  }

  async addUserToGroup(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members.push(user);
    return await this.save(group);
  }

  async addAdmin(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.admins.push(user);
    return await this.save(group);
  }

  async sendJoinRequest(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.memberJoinRequests.push(user);
    return await this.save(group);
  }

  async acceptJoinRequest(groupId: number, user: User): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members.push(user);
    group.memberJoinRequests = group.memberJoinRequests.filter(
      (joinRequest) => joinRequest.id !== user.id,
    );
    return await this.save(group);
  }

  async refuseJoinRequest(groupId: number, userId: number): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.memberJoinRequests = group.memberJoinRequests.filter(
      (member) => member.id !== userId,
    );
    return await this.save(group);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<Group> {
    const group = await this.findOne({
      where: { id: groupId },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
    if (!group) {
      throw new Error('Group not found');
    }
    group.members = group.members.filter((member) => member.id !== userId);
    return await this.save(group);
  }

  async findAll(): Promise<Group[]> {
    return await this.find({
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
  }

  async findOneById(id: number): Promise<Group | null> {
    return await this.findOne({
      where: { id },
      relations: ['members', 'memberJoinRequests', 'admins'],
    });
  }

  async findManyByName(name: string): Promise<Group[] | null> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.memberJoinRequests', 'memberJoinRequest')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('group.admins', 'admin')
      .where('LOWER(group.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .orderBy('group.name', 'ASC')
      .getMany();
  }
}
