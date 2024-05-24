import { Friendship } from '../entities/friendship.entity';
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  SaveOptions,
} from 'typeorm';

export interface IFriendshipRepository {
  findAll(): Promise<Friendship[]>;
  findOne(options: FindOneOptions<Friendship>): Promise<Friendship | null>;
  findOneBy(criteria: Record<string, any>): Promise<Friendship | null>;
  delete(criteria: Record<string, any>): Promise<DeleteResult>;
  save(
    friendship: DeepPartial<Friendship> | DeepPartial<Friendship>[],
    options?: SaveOptions,
  ): Promise<Friendship | Friendship[]>;
}
