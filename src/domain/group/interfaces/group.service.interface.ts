import { GroupDTO, GroupResponseDTO } from '@application/group/dto';

export interface IGroupService {
  createGroup(groupDTO: GroupDTO, userId: number): Promise<GroupResponseDTO>;
  updateGroup(groupDTO: GroupDTO, groupId: number): Promise<GroupResponseDTO>;
  addUserToGroup(groupId: number, userId: number): Promise<GroupResponseDTO>;
  removeUserFromGroup(groupId: number, userId: number): Promise<void>;
  listGroups(): Promise<GroupResponseDTO[]>;
  getGroupDetails(groupId: number): Promise<GroupResponseDTO | null>;
}
