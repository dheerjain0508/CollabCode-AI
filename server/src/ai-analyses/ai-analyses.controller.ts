import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { AiAnalysesService } from './ai-analyses.service';
import { AiAnalysis } from './schemas/ai-analysis.schema';
import { CreateAiAnalysisDto } from './dto/create-ai-analysis.dto';

@AllowAnonymous()
@Controller('ai-analyses')
export class AiAnalysesController {
  constructor(
    private readonly aiAnalysesService: AiAnalysesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateAiAnalysisDto) {
    return this.aiAnalysesService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.aiAnalysesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.aiAnalysesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() data: Partial<AiAnalysis>,
  ) {
    return this.aiAnalysesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.aiAnalysesService.remove(id);
  }
}