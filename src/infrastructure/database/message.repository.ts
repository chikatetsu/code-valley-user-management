import { DataSource, Repository } from 'typeorm';
import { Message } from '@domain/message/entities/message.entity';
import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '@domain/message/interfaces/message.repository.interface';
import { User } from '@domain/user/entities/user.entity';
import { Group } from '@domain/group/entities/group.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  async createMessage(
    value: string,
    author: User,
    group: Group,
  ): Promise<Message> {
    const createdAt = new Date();
    const message = this.create({ value, author, group, createdAt });
    return await this.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.find({ relations: ['author', 'group'] });
  }

  async getAllMessagesByGroupId(groupId: number): Promise<Message[]> {
    return await this.find({
      where: { groupId },
      relations: ['author', 'group'],
    });
  }
}
