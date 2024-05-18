import { UserResponseDTO } from '@application/user/dto';

export class GroupResponseDTO {
  id!: number;
  name!: string;
  members!: UserResponseDTO[];
}
