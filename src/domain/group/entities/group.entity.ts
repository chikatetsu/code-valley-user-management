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
  @Column({ type: 'varchar', unique: true })
  public name!: string;

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  public members!: User[];
}
