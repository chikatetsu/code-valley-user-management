import { Module } from '@nestjs/common';
import { UserService } from '@domain/user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@infra/database/user.repository';
import { User } from '@domain/user/entities/user.entity';
import { FirebaseModule } from '@application/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
