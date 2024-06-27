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
  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.unknown })
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

  constructor(obj = {}) {
    super();
    Object.assign(this, obj);
  }
}

export class NotificationBuilder {
  private readonly notification: Notification;

  constructor(message: string) {
    this.notification = new Notification();
    this.notification.createdAt = new Date();
    this.notification.hasBeenRead = false;
    this.notification.notificationType = NotificationType.unknown;
    this.notification.message = message;
  }

  public withCreatedAt(createdAt: Date): this {
    this.notification.createdAt = createdAt;
    return this;
  }

  public withHasBeenRead(hasBeenRead: boolean): this {
    this.notification.hasBeenRead = hasBeenRead;
    return this;
  }

  public withNotificationType(notificationType: NotificationType): this {
    this.notification.notificationType = notificationType;
    return this;
  }

  public withMessage(message: string): this {
    this.notification.message = message;
    return this;
  }

  public build(): Notification {
    return this.notification;
  }
}
