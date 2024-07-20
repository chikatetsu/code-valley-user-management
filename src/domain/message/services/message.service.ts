import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '@domain/message/entities/message.entity';
import { MessageDTO, MessageResponseDTO } from '@application/message/dto';
import { User } from '@domain/user/entities/user.entity';
import { UserResponseDTO } from '@application/user/dto';
import { IMessageService } from '@domain/message/interfaces/message.service.interface';
import { MessageRepository } from '@infra/database/message.repository';
import { Group } from '@domain/group/entities/group.entity';
import { GroupResponseDTO } from '@application/group/dto';
import { UserRepository } from '@infra/database/user.repository';
import { GroupRepository } from '@infra/database/group.repository';
import { ContentService } from '@domain/content/content.service';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private readonly messageRepository: MessageRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
    private readonly contentService: ContentService,
  ) {}

  async createMessage(
    messageDTO: MessageDTO,
    file: Express.Multer.File,
  ): Promise<MessageResponseDTO> {
    const author = await this.userRepository.findOneById(
      Number(messageDTO.authorId),
    );
    const group = await this.groupRepository.findOneById(
      Number(messageDTO.groupId),
    );
    const message = await this.messageRepository.createMessage(
      messageDTO.value,
      author,
      group,
      '',
    );

    let fileId: string | null = null;
    let code_url: string | null = null;
    if (file) {
      const fileResponse = await this.contentService.uploadFileForMessage(
        file,
        author.id,
        group.id,
        message.id,
      );
      [fileId, code_url] = [fileResponse.id, fileResponse.code_url];
    }
    message.file = code_url !== null ? code_url : '';

    await this.messageRepository.save(message);
    return this.toMessageResponseDTO(message);
  }

  async listMessages(): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findAll();
    return messages.map(this.toMessageResponseDTO);
  }
  async getMessagesByGroupId(groupId: number): Promise<MessageResponseDTO[]> {
    const messages =
      await this.messageRepository.getAllMessagesByGroupId(groupId);
    return messages ? this.toManyResponseDto(messages) : null;
  }

  private toMessageResponseDTO = (message: Message): MessageResponseDTO => {
    return {
      id: message.id,
      value: message.value,
      author: this.toUserResponseDTO(message.author),
      group: this.toGroupResponseDTO(message.group),
      createdAt: message.createdAt,
      file: message.file,
    };
  };

  private toManyResponseDto(messages: Message[]): MessageResponseDTO[] {
    let response: MessageResponseDTO[] = [];
    for (let message of messages) {
      response.push(this.toMessageResponseDTO(message));
    }
    return response;
  }

  private toUserResponseDTO = (user: User): UserResponseDTO => {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      avatar: user.avatar,
    };
  };

  private toGroupResponseDTO = (group: Group): GroupResponseDTO => {
    return {
      id: group.id,
      name: group.name,
      members: group.members,
      admins: group.admins,
      description: group.description,
      isPublic: group.isPublic,
      avatar: group.avatar,
      memberJoinRequests: group.memberJoinRequests,
    };
  };
}
