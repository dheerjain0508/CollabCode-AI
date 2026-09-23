import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller()
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post('users/:userId/projects/:projectId/apply')
  @HttpCode(HttpStatus.CREATED)
  applyToProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationsService.applyToProject(
      userId,
      projectId,
      createApplicationDto,
    );
  }

  @AllowAnonymous()
  @Get('projects/:projectId/applications')
  @HttpCode(HttpStatus.OK)
  getProjectApplications(
    @Param('projectId') projectId: string,
  ) {
    return this.applicationsService.getProjectApplications(projectId);
  }

  @Patch('applications/:applicationId')
  @HttpCode(HttpStatus.OK)
  updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateApplicationStatus(
      applicationId,
      updateApplicationStatusDto.status,
    );
  }
}