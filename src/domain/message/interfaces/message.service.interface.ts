import { MessageDTO, MessageResponseDTO } from '@application/message/dto';

export interface IMessageService {
  createMessage(messageDTO: MessageDTO): Promise<MessageResponseDTO>;
  listMessages(): Promise<MessageResponseDTO[]>;
  getMessagesByGroupId(groupId: number): Promise<MessageResponseDTO[]>;
}
