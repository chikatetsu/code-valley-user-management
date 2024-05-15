import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';

@Entity()
export class Friendship extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.sentFriendships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' })
  public sender!: User;

  @ApiProperty()
  @Column()
  public senderId!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.receivedFriendships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiverId' })
  public receiver!: User;

  @ApiProperty()
  @Column()
  public receiverId!: number;

  @ApiProperty()
  @Column({ type: 'varchar', default: 'pending' })
  public status!: 'pending' | 'accepted' | 'declined';

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;
}
