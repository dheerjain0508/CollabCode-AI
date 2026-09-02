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

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProjectsModule,
    ApplicationsModule,
    SkillsModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}