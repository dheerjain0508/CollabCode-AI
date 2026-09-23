import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { SkillsModule } from './skills/skills.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ApplicationsModule } from './applications/applications.module';
import { auth } from './auth';
import { JavascriptConceptsController } from './common/javascript-concepts/javascript-concepts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAnalysesModule } from './ai-analyses/ai-analyses.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { SqlJoinsModule } from './sql-joins/sql-joins.module';
import { HttpStatusCodesModule } from './common/http-status-codes/http-status-codes.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProjectsModule,
    ApplicationsModule,
    SkillsModule,
    SqlJoinsModule,
    HttpStatusCodesModule,

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

  controllers: [AppController, JavascriptConceptsController],
  providers: [
    AppService,
    NotificationsGateway,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}