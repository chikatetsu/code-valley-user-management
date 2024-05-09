import { UserCreateDTO } from 'src/application/user/dto/UserCreate.dto';
import { User } from '../entities/user.entity';
import { UserResponseDTO } from 'src/application/user/dto/UserResponse.dto';
import { UserIdDTO } from 'src/application/user/dto/UserId.dto';
import { UserQueryDTO } from 'src/application/user/dto/UserQuery.dto';


export interface IUserService {
  findAll(): Promise<User[]>;
  findOne(dto: UserIdDTO): Promise<User | null>;
  remove(dto: UserIdDTO): Promise<void>;
  getUserByEmail(query: UserQueryDTO): Promise<User>;
  getUserByUsernameOrEmail(query: UserQueryDTO): Promise<User>;
  createUser(user: UserCreateDTO): Promise<UserResponseDTO>;
  isUsernameTaken(query: UserQueryDTO): Promise<boolean>;
  generateUsername(firstName: string, lastName: string): Promise<string>;
  findOrCreate(googleUser: any): Promise<User>;
  updateLastLoginAt(dto: UserIdDTO): Promise<User>;
}
