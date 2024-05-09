import { Injectable } from '@nestjs/common';
import { User, UserBuilder } from '@domain/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../interfaces/user.service.interface';
import { UserQueryDTO, UserResponseDTO, UserCreateDTO, UserIdDTO } from '@application/user/dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(dto: UserIdDTO): Promise<User | null> {
    if (!dto.id) {
      return null;
    }
    return this.repository.findOneBy({ id: dto.id });
  }

  async remove(dto: UserIdDTO): Promise<void> {
    await this.repository.delete({ id: dto.id });
  }

  async getUserByEmail(query: UserQueryDTO): Promise<User> {
    return this.repository.findOneBy({ email: query.email });
  }

  async getUserByUsernameOrEmail(query: UserQueryDTO): Promise<User> {
    let userByUsername = this.repository.findOneBy({ username: query.username });
    let userByEmail = this.repository.findOneBy({ email: query.email });

    return userByUsername || userByEmail;
  }

  async createUser(createDto: UserCreateDTO): Promise<UserResponseDTO> {
    const user = new UserBuilder()
        .withEmail(createDto.email)
        .withUsername(createDto.username ?? await this.generateUsername(createDto.firstName, createDto.lastName))
        .withPassword(createDto.password ?? null)
        .build();

    const savedUser = await this.repository.save(user);
    return this.toResponseDto(savedUser);
  }

  async isUsernameTaken(query: UserQueryDTO): Promise<boolean> {
    const user = await this.repository.findOneBy({ username: query.username });
    return Boolean(user); 
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    let baseUsername = `${firstName}_${lastName}`;
    let username = baseUsername;
    let i = 1;
  
    while (await this.isUsernameTaken({ username })) {
      username = `${baseUsername}${i}`; 
      i++;
    }

    return username;
  }
  
  public async findOrCreate(googleUser: any): Promise<User> {
    let user: User = await this.getUserByEmail(googleUser.email);

    if (!user) {
      user = new UserBuilder()
      .withEmail(googleUser.email)
      .withUsername(await this.generateUsername(googleUser.firstName, googleUser.lastName))
      .withCreatedAt(new Date())
      .build();
      
      let userDto = await this.createUser(this.toUserCreateDto(user));
      user = await this.repository.findOneBy({ id: userDto.id });
    }

    user = await this.updateLastLoginAt({ id: user.id });
    return user;
  }

  async updateLastLoginAt(dto: UserIdDTO): Promise<User> {
    return this.repository.save({
      id: dto.id,
      lastLoginAt: new Date(),
    });
  }

    private toResponseDto(user: User): UserResponseDTO {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
    };
  }

  private toUserCreateDto(user: User): UserCreateDTO {
    return {
      email: user.email,
      username: user.username,
      password: user.password,
    };
  }
}
