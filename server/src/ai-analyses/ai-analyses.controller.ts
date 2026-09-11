import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';

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
create(@Body() data: CreateAiAnalysisDto) {
  return this.aiAnalysesService.create(data);
}

  @Get()
  findAll() {
    return this.aiAnalysesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiAnalysesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<AiAnalysis>,
  ) {
    return this.aiAnalysesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiAnalysesService.remove(id);
  }
}