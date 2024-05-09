import { Injectable, Logger } from '@nestjs/common';
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
    if (!id) {
      return null;
    }
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

  async isUsernameTaken(username: string): Promise<boolean> {
    return this.repository.findOneBy({ username: username }) !== null;
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    let username = firstName + "_" + lastName;
    let i = 1;

    while (await this.isUsernameTaken(username)) {
      username = firstName + "_" + lastName + i;
      i++;
    }

    return username;
  }

  public async findOrCreate(googleUser: any): Promise<User> {
    let user: User = await this.getUser(googleUser.email);

    if (!user) {
      user = new User();
      user.email = googleUser.email;
      user.username = await this.generateUsername(googleUser.firstName, googleUser.lastName);
      user.createdAt = new Date();
      user.lastLoginAt = new Date();
      user = await this.createUser(user);
    }

    return user;
  }

  async updateLastLoginAt(id: number): Promise<User> {
    return this.repository.save({
      id: id,
      lastLoginAt: new Date(),
    });
  }
}
