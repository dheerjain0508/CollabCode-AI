import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { AllowAnonymous,Session} from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}
  @AllowAnonymous()
@Get('countries/:code')
getCountryInfo(@Param('code') code: string) {
  return this.projectsService.getCountryInfo(code);
}
  // Public: anyone can view projects
 // Public: anyone can view projects
@AllowAnonymous()
@HttpCode(HttpStatus.OK)
@Get('projects')
getAllProjects(@Query('status') status?: string) {
  return this.projectsService.getAllProjects(status);
}

// SQL JOIN: projects with their owners
@AllowAnonymous()
@Get('projects-with-owners')
getProjectsWithOwners() {
  return this.projectsService.getProjectsWithOwners();
}

// Public: anyone can view project details
@AllowAnonymous()
@Get('projects/:id')
getProjectById(@Param('id') id: string) {
  return this.projectsService.getProjectById(id);
}

  // Protected: create a project
  @Post('users/:userId/projects')
  @HttpCode(HttpStatus.CREATED)
createProject(
  @Session() session: UserSession,
  @Body() createProjectDto: CreateProjectDto,
) {
  return this.projectsService.createProject(
    session.user.id,
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