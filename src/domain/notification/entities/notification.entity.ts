import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/user/entities/user.entity';
import { NotificationType } from '@domain/notification/types/notification.type';

@Entity()
export class Notification extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  public hasBeenRead!: boolean;

  @ApiProperty()
  @Column({ type: 'enum', enum: NotificationType })
  public notificationType!: NotificationType;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromUserId' })
  public fromUser!: User;

  @ApiProperty()
  @Column()
  public fromUserId!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toUserId' })
  public toUser!: User;

  @ApiProperty()
  @Column()
  public toUserId!: number;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  public linkId: number;

  constructor(
    notificationType: NotificationType,
    fromUserId: number,
    toUserId: number,
    linkId: number = null,
  ) {
    super();
    this.notificationType = notificationType;
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.hasBeenRead = false;
    this.createdAt = new Date();
    if (linkId) {
      this.linkId = linkId;
    }
  }
}
