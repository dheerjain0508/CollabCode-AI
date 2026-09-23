import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SqlJoinsService } from './sql-joins.service';

/**
 * SqlJoinsController
 * Exposes API endpoints for demonstrating PostgreSQL SQL JOIN queries.
 * Every endpoint explicitly annotates @HttpCode(HttpStatus.OK) for correct HTTP status code usage.
 */
@AllowAnonymous()
@Controller('sql-joins')
export class SqlJoinsController {
  constructor(private readonly sqlJoinsService: SqlJoinsService) {}

  @Get('inner-join')
  @HttpCode(HttpStatus.OK)
  async getInnerJoin() {
    return this.sqlJoinsService.getInnerJoinProjectsAndOwners();
  }

  @Get('left-join')
  @HttpCode(HttpStatus.OK)
  async getLeftJoin() {
    return this.sqlJoinsService.getLeftJoinUsersAndProfiles();
  }

  @Get('right-join')
  @HttpCode(HttpStatus.OK)
  async getRightJoin() {
    return this.sqlJoinsService.getRightJoinApplicationsAndProjects();
  }

  @Get('full-outer-join')
  @HttpCode(HttpStatus.OK)
  async getFullOuterJoin() {
    return this.sqlJoinsService.getFullOuterJoinUsersAndApplications();
  }

  @Get('cross-join')
  @HttpCode(HttpStatus.OK)
  async getCrossJoin() {
    return this.sqlJoinsService.getCrossJoinUserSkillMatrix();
  }

  @Get('self-join')
  @HttpCode(HttpStatus.OK)
  async getSelfJoin() {
    return this.sqlJoinsService.getSelfJoinPeerPairs();
  }
}
