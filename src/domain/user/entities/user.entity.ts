import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  public twoFactorAuthenticationSecret: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  constructor(obj = {}) {
    super();
    Object.assign(this, obj);
  }
}

export class UserBuilder {
  private user: User;
  private currentDateTime: Date = new Date();

  constructor() {
    this.user = new User();
    this.user.createdAt = this.currentDateTime;
    this.user.lastLoginAt = this.currentDateTime;
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

  public withCreatedAt(createdAt: Date): this {
    this.user.createdAt = createdAt;
    return this;
  }

  public build(): User {
    return this.user;
  }
}
