import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ApiProperty()
  @Column({ type: 'text'})
  public message!: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' })
  public user!: User;

  @ApiProperty()
  @Column()
  public userId!: number;

  constructor(notificationType: NotificationType, message: string, userId: number) {
    super();
    this.notificationType = notificationType;
    this.message = message;
    this.userId = userId
    this.hasBeenRead = false;
    this.createdAt = new Date();
  }
}
