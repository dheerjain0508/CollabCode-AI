import {Body,Controller,Get,Param,Patch,Post,} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller()
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post('users/:userId/projects/:projectId/apply')
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

  @Get('projects/:projectId/applications')
  getProjectApplications(
    @Param('projectId') projectId: string,
  ) {
    return this.applicationsService.getProjectApplications(projectId);
  }

  @Patch('applications/:applicationId')
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