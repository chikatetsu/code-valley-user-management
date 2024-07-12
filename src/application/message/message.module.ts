import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '@application/message/message.controller';
import { MessageService } from '@domain/message/services/message.service';
import { MessageRepository } from '@infra/database/message.repository';
import { Message } from '@domain/message/entities/message.entity';
import { NotFoundInterceptor } from './interceptors';
import { Group } from '@domain/group/entities/group.entity';
import { User } from '@domain/user/entities/user.entity';
import { UserRepository } from '@infra/database/user.repository';
import { GroupRepository } from '@infra/database/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Group, User])],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    UserRepository,
    GroupRepository,
    NotFoundInterceptor,
  ],
})
export class MessageModule {}
