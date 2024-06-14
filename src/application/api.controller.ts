import packageJson from '../../package.json';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api')
@ApiTags('api')
export class ApiController {
    constructor() { }

    @Get('health')
    @ApiResponse({ status: 200, type: String })
    async health(): Promise<string> {
        return 'OK';
    }

    @Get('version')
    @ApiResponse({ status: 200, type: String })
    async version(): Promise<string> {
        return packageJson.version;
    }
}
