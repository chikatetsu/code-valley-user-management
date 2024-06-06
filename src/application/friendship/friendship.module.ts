import { Module } from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipRepository } from '@infra/database/friendship.repository';
import { Friendship } from '@domain/friendship/entities/friendship.entity';
import { User } from '@domain/user/entities/user.entity';
import { FriendshipController } from './friendship.controller';
import { FriendshipInterceptor } from './interceptors/friendship.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User])],
  providers: [FriendshipRepository, FriendshipService, FriendshipInterceptor],
  controllers: [FriendshipController],
  exports: [FriendshipService],
})
export class FriendshipModule {}
