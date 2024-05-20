import { GroupDTO, GroupResponseDTO } from '@application/group/dto';

export interface IGroupService {
  createGroup(groupDTO: GroupDTO): Promise<GroupResponseDTO>;
  addUserToGroup(groupId: number, userId: number): Promise<GroupResponseDTO>;
  removeUserFromGroup(groupId: number, userId: number): Promise<void>;
  listGroups(): Promise<GroupResponseDTO[]>;
  getGroupDetails(groupId: number): Promise<GroupResponseDTO | null>;
}
