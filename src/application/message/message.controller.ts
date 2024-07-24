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
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { MessageService } from '@domain/message/services/message.service';
import { MessageResponseDTO, MessageDTO } from '@application/message/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundInterceptor } from './interceptors';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('messages')
@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(NotFoundInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (
          !RegExp(
            /(jpg|jpeg|png|gif|javascript|js|rust|rs|lua|python|py|cpp|cs|java|ipynb|ts)$/,
          ).exec(ext)
        ) {
          callback(
            new BadRequestException(
              `Extension '${ext}' is not allowed, only .jpg, .jpeg, .png, .gif, .js, .rs, .lua, .py, .cpp, .cs, .java, .ipynb, .ts are allowed`,
            ),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MessageDTO })
  @ApiResponse({ status: 201, type: MessageResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createMessage(
    @Body() messageDTO: MessageDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponseDTO> {
    return this.messageService.createMessage(messageDTO, file);
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
