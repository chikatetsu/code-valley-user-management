import { User } from '@domain/user/entities/user.entity';
import { Group } from '@domain/group/entities/group.entity';

export interface IGroupRepository {
  createGroup(name: string, members: User[]): Promise<Group>;
  addUserToGroup(groupId: number, user: User): Promise<Group>;
  removeUserFromGroup(groupId: number, userId: number): Promise<Group>;
  findAll(): Promise<Group[]>;
  findOneById(id: number): Promise<Group | null>;
}
