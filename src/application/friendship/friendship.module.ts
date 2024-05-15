import { Module } from '@nestjs/common';
import { FriendshipService } from '@domain/friendship/services/friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipRepository } from '@infra/database/friendship.repository';
import { Friendship } from '@domain/friendship/entities/friendship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship])],
  providers: [FriendshipRepository, FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
