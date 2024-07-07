import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  ParseIntPipe,
  UseGuards,
  Req,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from '@domain/message/services/message.service';
import { MessageResponseDTO, MessageDTO } from '@application/message/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundInterceptor } from './interceptors';
@Controller('messages')
@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(NotFoundInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create')
  @ApiBody({ type: MessageDTO })
  @ApiResponse({ status: 201, type: MessageResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createMessage(
    @Body() messageDTO: MessageDTO,
  ): Promise<MessageResponseDTO> {
    return this.messageService.createMessage(messageDTO);
  }

  @Get('list')
  @ApiResponse({ status: 200, type: [MessageResponseDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async listMessages(@Req() req: any): Promise<MessageResponseDTO[]> {
    return this.messageService.listMessages();
  }

  @Get('conversation/:groupId')
  @ApiResponse({ status: 200, type: [MessageResponseDTO] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getMessagesByGroupId(
    @Req() req: any,
    @Param('groupId') groupId: string,
  ): Promise<MessageResponseDTO[]> {
    return this.messageService.getMessagesByGroupId(Number(groupId));
  }
}
