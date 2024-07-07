import { Message } from '@domain/message/entities/message.entity';

export interface IMessageRepository {
  createMessage(
    value: string,
    authorId: number,
    groupId: number,
    createdAt: Date,
  ): Promise<Message>;
  findAll(): Promise<Message[]>;
  getAllMessagesByGroupId(groupId: number): Promise<Message[]>;
}
