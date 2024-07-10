import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from '@application/group/group.controller';
import { GroupService } from '@domain/group/services/group.service';
import { GroupRepository } from '@infra/database/group.repository';
import { UserRepository } from '@infra/database/user.repository';
import { Group } from '@domain/group/entities/group.entity';
import { User } from '@domain/user/entities/user.entity';
import { NotFoundInterceptor, CreateGroupInterceptor } from './interceptors';
import { ContentService } from '@domain/content/content.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), HttpModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    UserRepository,
    ContentService,
    NotFoundInterceptor,
    CreateGroupInterceptor,
  ],
})
export class GroupModule {}
