import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@domain/notification/entities/notification.entity';
import { User } from '@domain/user/entities/user.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from '@domain/notification/services/notification.service';
import { NotificationRepository } from '@infra/database/notification.repository';
import { FriendshipModule } from '@application/friendship/friendship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    forwardRef(() => FriendshipModule),
  ],
  providers: [NotificationRepository, NotificationService],
  controllers: [NotificationController],
  exports: [NotificationRepository, NotificationService],
})
export class NotificationModule {}
