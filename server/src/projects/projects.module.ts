import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, NotificationsGateway],
})
export class ProjectsModule {}