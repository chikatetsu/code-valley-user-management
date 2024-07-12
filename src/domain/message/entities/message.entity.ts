import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';
import { Group } from '@domain/group/entities/group.entity';

@Entity()
export class Message extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  public value!: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinTable()
  public author!: User;

  @ApiProperty()
  @Column()
  public authorId!: number;

  @ApiProperty({ type: () => Group })
  @ManyToOne(() => Group)
  @JoinTable()
  public group!: Group;

  @ApiProperty()
  @Column()
  public groupId!: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;
}
