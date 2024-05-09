import { Module } from '@nestjs/common';
import { UserService } from '@domain/user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@infra/database/user.repository';
import { User } from '@domain/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
