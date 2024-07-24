import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserBuilder } from '@domain/user/entities/user.entity';
import { IUserService } from '../interfaces/user.service.interface';
import {
  UserQueryDTO,
  UserResponseDTO,
  UserCreateDTO,
  UserIdDTO,
} from '@application/user/dto';
import { GoogleUser } from 'interfaces/google-user.interface';
import { UserRepository } from '@infra/database/user.repository';
import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import path from 'path';

@Injectable()
export class UserService implements IUserService {
  private storage: Storage;
  private bucketName: string;

  constructor(
    private userRepository: UserRepository,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async findOne(dto: UserIdDTO): Promise<User | null> {
    if (!dto.id) {
      return null;
    }
    return await this.userRepository.findOneById(dto.id);
  }

  async findOneById(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  async findOneUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOneByUsername(username);
    return this.toResponseDto(user);
  }

  async findManyByUsername(username: string): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findManyByUsername(username);
    return this.toManyResponseDto(users);
  }

  async remove(dto: UserIdDTO): Promise<void> {
    await this.userRepository.delete({ id: dto.id });
  }

  async findOneByEmail(query: UserQueryDTO): Promise<User> {
    return this.userRepository.findOneByEmail(query.email);
  }

  async getUserByUsernameOrEmail(query: UserQueryDTO): Promise<User> {
    let userByUsername = this.userRepository.findOneByUsername(query.username);
    let userByEmail = this.userRepository.findOneByEmail(query.email);

    return userByUsername && userByEmail;
  }

  async createUser(createDto: UserCreateDTO): Promise<UserResponseDTO> {
    const user = new UserBuilder()
      .withEmail(createDto.email)
      .withUsername(
        createDto.username ??
          (await this.generateUsername(
            createDto.firstName,
            createDto.lastName,
          )),
      )
      .withPassword(createDto.password ?? null)
      .withAvatar(createDto.avatar)
      .build();

    const savedUser = await this.userRepository.save(user);
    return this.toResponseDto(savedUser);
  }

  async isUsernameTaken(query: UserQueryDTO): Promise<boolean> {
    const user = await this.userRepository.findOneByUsername(query.username);
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

  public async findOrCreate(googleUser: GoogleUser): Promise<User> {
    let userQuery = new UserQueryDTO();
    userQuery.email = googleUser.email;
    let user: User = await this.findOneByEmail(userQuery);

    if (!user) {
      user = new UserBuilder()
        .withEmail(googleUser.email)
        .withUsername(
          await this.generateUsername(
            googleUser.firstName,
            googleUser.lastName,
          ),
        )
        .withAvatar(googleUser.picture)
        .withCreatedAt(new Date())
        .build();

      let userDto = await this.createUser(this.toUserCreateDto(user));
      user = await this.userRepository.findOneById(userDto.id);
    }

    user = await this.updateLastLoginAt({ id: user.id });
    return user;
  }

  async updateLastLoginAt(dto: UserIdDTO): Promise<User> {
    return this.userRepository.save({
      id: dto.id,
      lastLoginAt: new Date(),
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.userRepository.save({
      id: userId,
      twoFactorAuthenticationSecret: secret,
    });
  }

  async changeStateTwoFactorAuthentication(userId: number, state: boolean) {
    return this.userRepository.save({
      id: userId,
      isTwoFactorAuthenticationEnabled: state,
      twoFactorAuthenticationSecret: null,
    });
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const user = await this.findOneById(userId);
    const bucket = admin.storage().bucket();
    const fileName = `avatars/${userId}-${Date.now()}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Blob stream error:', err);
        reject(new BadRequestException('Failed to upload avatar to Firebase'));
      });

      stream.on('finish', async () => {
        const [signedUrl] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-17-2025',
        });
        user.avatar = signedUrl;
        await this.userRepository.save(user);
        resolve(signedUrl);
      });

      stream.end(file.buffer);
    });
  }

  /** Private methods */
  private toResponseDto(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      avatar: user.avatar,
    };
  }

  private toUserCreateDto(user: User): UserCreateDTO {
    return {
      email: user.email,
      username: user.username,
      password: user.password,
      avatar: user.avatar,
    };
  }

  private toManyResponseDto(users: User[]): UserResponseDTO[] {
    let response: UserResponseDTO[] = [];
    for (let user of users) {
      response.push(this.toResponseDto(user));
    }
    return response;
  }
}
