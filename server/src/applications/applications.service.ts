import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async applyToProject(
    userId: string,
    projectId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.application.create({
      data: {
        applicantId: userId,
        projectId: projectId,
        message: createApplicationDto.message,
      },
    });
  }
  async getProjectApplications(projectId: string) {
  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return this.prisma.application.findMany({
    where: {
      projectId,
    },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
async updateApplicationStatus(
  applicationId: string,
  status: string,
) {
  const application = await this.prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new NotFoundException('Application not found');
  }

  const updatedApplication = await this.prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  if (status === 'ACCEPTED') {
    await this.prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: application.projectId,
          userId: application.applicantId,
        },
      },
      update: {},
      create: {
        projectId: application.projectId,
        userId: application.applicantId,
      },
    });
  }

  return updatedApplication;
}
}