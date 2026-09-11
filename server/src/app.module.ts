import { Module } from '@nestjs/common';

import { AuthModule } from '@thallesp/nestjs-better-auth';

import { SkillsModule } from './skills/skills.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ApplicationsModule } from './applications/applications.module';
import { auth } from './auth';

import { MongooseModule } from '@nestjs/mongoose';
import { AiAnalysesModule } from './ai-analyses/ai-analyses.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProjectsModule,
    ApplicationsModule,
    SkillsModule,

    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AiAnalysesModule,

    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: {
          limit: '2mb',
          extended: true,
        },
      },
    }),

    AiAssistantModule,
  ],

  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}