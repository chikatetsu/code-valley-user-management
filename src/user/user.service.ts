import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      email: 'john@gmail.com',
      username: 'john',
      password: 'changeme',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
    {
      id: 2,
      email: 'maria@gmail.com',
      username: 'maria',
      password: 'guess',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
  ];

  async getUser(username: string): Promise<User> {
    return this.users.find((user) => user.username === username);
  }
}
