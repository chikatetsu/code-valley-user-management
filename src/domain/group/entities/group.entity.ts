import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@domain/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Group extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  public name!: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public description: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public avatar: string;

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  public members!: User[];

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  public admins!: User[];

  @ApiProperty()
  @Column()
  public isPublic: boolean;

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  public memberJoinRequests!: User[];
}
