// application/code.module.ts
import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from '../../domain/code/code.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
