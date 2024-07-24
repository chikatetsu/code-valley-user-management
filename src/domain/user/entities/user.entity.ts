import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { Post } from '@domain/post/entities/post.entity';
import { Notification } from '@domain/notification/entities/notification.entity';
import { Comment } from '@domain/post/entities/comment.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', unique: true })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  public password?: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  public username!: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public avatar: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public twoFactorAuthenticationSecret: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @OneToMany(() => Friendship, (friendship) => friendship.sender)
  public sentFriendships!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.receiver)
  public receivedFriendships!: Friendship[];

  @OneToMany(() => Post, (post) => post.user)
  public posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.toUser)
  public notifications: Notification[];

  constructor(obj = {}) {
    super();
    Object.assign(this, obj);
  }
}

export class UserBuilder {
  private readonly user: User;

  constructor() {
    this.user = new User();
    const currentDateTime: Date = new Date();
    this.user.createdAt = currentDateTime;
    this.user.lastLoginAt = currentDateTime;
  }

  public withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  public withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  public withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  public withLastLoginAt(lastLoginAt: Date): this {
    this.user.lastLoginAt = lastLoginAt;
    return this;
  }

  public withAvatar(avatar: string): this {
    this.user.avatar = avatar;
    return this;
  }

  public withCreatedAt(createdAt: Date): this {
    this.user.createdAt = createdAt;
    return this;
  }

  public build(): User {
    return this.user;
  }
}
