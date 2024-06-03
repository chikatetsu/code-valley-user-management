import { Controller, Post, Body } from '@nestjs/common';
import { CodeService } from '../../domain/code/code.service';
import { ExecutionPayloadDto } from './dto/execution-payload.dto';
import { ExecutionResultDto } from './dto/execution-result.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('code')
@ApiTags('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('execute')
  @ApiBody({ type: ExecutionPayloadDto })
  @ApiResponse({ status: 200, type: ExecutionResultDto })
  async executeCode(
    @Body() payload: ExecutionPayloadDto,
  ): Promise<ExecutionResultDto> {
    return this.codeService.executeCode(payload);
  }
}
