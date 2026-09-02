import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  // Public: anyone can view projects
  @AllowAnonymous()
  @Get('projects')
  getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  // Public: anyone can view project details
  @AllowAnonymous()
  @Get('projects/:id')
  getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  // Protected: create a project
  @Post('users/:userId/projects')
  createProject(
    @Param('userId') userId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(
      userId,
      createProjectDto,
    );
  }

  // Public: view project members
  @AllowAnonymous()
  @Get('projects/:id/members')
  getProjectMembers(@Param('id') id: string) {
    return this.projectsService.getProjectMembers(id);
  }
}