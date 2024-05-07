import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getUser(email: string): Promise<User> {
    return this.repository.findOneBy({ email: email });
  }

  async createUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async updateLastLoginAt(id: number): Promise<User> {
    return this.repository.save({
      id: id,
      lastLoginAt: new Date(),
    });
  }
}
