import { DataSource, Repository } from 'typeorm';
import { User } from '@domain/user/entities/user.entity';
import { UserQueryDTO } from '@application/user/dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findManyByIds(ids: number[]): Promise<User[]> {
    let users: User[] = [];
    for (const id of ids) {
      const user = await this.findOneById(id);
      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`);
      }

      users.push(user);
    }

    return users;
  }

  async findOneById(id: number): Promise<User | null> {
    return this.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.findOneBy({ username });
  }

  async findAll(): Promise<User[]> {
    return this.find();
  }

  async findByUsernameOrEmail(query: UserQueryDTO): Promise<User | null> {
    const { username, email } = query;
    return this.createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username,
        email,
      })
      .getOne();
  }
}
