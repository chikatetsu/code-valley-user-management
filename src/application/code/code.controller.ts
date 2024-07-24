import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CodeService } from '../../domain/code/code.service';
import { ExecutionResultDto } from './dto/execution-result.dto';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExecutionPayloadDto } from './dto';
import { Response } from 'express';

@Controller('code')
@ApiTags('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('execute')
  @UseInterceptors(FileInterceptor('input_file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ExecutionPayloadDto })
  @ApiResponse({ status: 200, type: ExecutionResultDto })
  async executeCode(
    @Body() body: ExecutionPayloadDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    const payload = {
      language: body.language,
      code: body.code,
      output_extension: body.output_extension,
      input_file: file,
    };

    const result = await this.codeService.executeCode(payload);

    if (result.outputFile && result.outputFileContent) {
      const fileContent = Buffer.from(result.outputFileContent, 'base64');
      result.outputFileContent = fileContent.toString('base64');
    }

    res.json(result);
  }
}
