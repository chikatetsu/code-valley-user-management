import { Module } from '@nestjs/common';
import { UserService } from '@domain/user/services/user.service';
import { User } from '@domain/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
