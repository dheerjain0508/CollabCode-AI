import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AiAssistantService } from './ai-assistant.service';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(
    private readonly aiAssistantService: AiAssistantService,
  ) {}

  @AllowAnonymous()
  @Post('analyze')
  analyzeProject(
    @Body()
    body: {
      jobTitle: string;
      projectDescription: string;
      requiredSkills: string[];
    },
  ) {
    return this.aiAssistantService.analyzeProject(
      body.jobTitle,
      body.projectDescription,
      body.requiredSkills,
    );
  }
}