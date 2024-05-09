import { Injectable } from '@nestjs/common';
import { User, UserBuilder } from '../entities/user.entity';
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

  async getUserByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email: email });
  }

  async getUserByUsernameOrEmail(username: string, email: string): Promise<User> {
    let userByUsername = this.repository.findOneBy({ username: username });
    let userByEmail = this.repository.findOneBy({ email: email });

    return userByUsername || userByEmail;
  }

  async createUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.repository.findOneBy({ username: username });
    return Boolean(user); 
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    let baseUsername = `${firstName}_${lastName}`;
    let username = baseUsername;
    let i = 1;
  
    while (await this.isUsernameTaken(username)) {
      username = `${baseUsername}${i}`; 
      i++;
    }

    return username;
  }
  
  public async findOrCreate(googleUser: any): Promise<User> {
    const currentDate = new Date();
    let user: User = await this.getUserByEmail(googleUser.email);

    if (!user) {
      user = new UserBuilder()
      .withEmail(googleUser.email)
      .withUsername(await this.generateUsername(googleUser.firstName, googleUser.lastName))
      .withLastLoginAt(currentDate)
      .withLastLoginAt(currentDate)
      .build();

      user = await this.createUser(user);
    }

    user = await this.updateLastLoginAt(user.id);
    return user;
  }

  async updateLastLoginAt(id: number): Promise<User> {
    return this.repository.save({
      id: id,
      lastLoginAt: new Date(),
    });
  }
}
