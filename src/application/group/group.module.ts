import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from '@application/group/group.controller';
import { GroupService } from '@domain/group/services/group.service';
import { GroupRepository } from '@infra/database/group.repository';
import { UserRepository } from '@infra/database/user.repository';
import { Group } from '@domain/group/entities/group.entity';
import { User } from '@domain/user/entities/user.entity';
import { GroupInterceptor } from './group.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, UserRepository, GroupInterceptor],
})
export class GroupModule {}
