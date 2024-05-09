import { User } from '../entities/user.entity';
import { DeepPartial, DeleteResult, FindOneOptions, SaveOptions } from 'typeorm';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findOne(FindOneOptions: FindOneOptions<User>): Promise<User | null>;
  findOneBy(criteria: Record<string, any>): Promise<User | null>;
  delete(criteria: Record<string, any>): Promise<DeleteResult>;
  save(user: DeepPartial<User> | DeepPartial<User>[], options?: SaveOptions): Promise<User | User[]>
}
