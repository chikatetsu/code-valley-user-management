import { MessageDTO, MessageResponseDTO } from '@application/message/dto';

export interface IMessageService {
  createMessage(
    messageDTO: MessageDTO,
    file: Express.Multer.File,
  ): Promise<MessageResponseDTO>;
  listMessages(): Promise<MessageResponseDTO[]>;
  getMessagesByGroupId(groupId: number): Promise<MessageResponseDTO[]>;
}
