import { UserCreateDTO, UserIdDTO, UserQueryDTO, UserResponseDTO } from "@application/user/dto";
import { User } from "../entities/user.entity";

export interface IUserService {
  findOne(dto: UserIdDTO): Promise<UserResponseDTO | null>;
  remove(dto: UserIdDTO): Promise<void>;
  findOneByEmail(query: UserQueryDTO): Promise<User>;
  getUserByUsernameOrEmail(query: UserQueryDTO): Promise<User>;
  createUser(user: UserCreateDTO): Promise<UserResponseDTO>;
  isUsernameTaken(query: UserQueryDTO): Promise<boolean>;
  generateUsername(firstName: string, lastName: string): Promise<string>;
  findOrCreate(googleUser: any): Promise<User>;
  updateLastLoginAt(dto: UserIdDTO): Promise<User>;
}
