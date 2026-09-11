import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
@Injectable()
export class ProjectsService {
constructor(
  private readonly prisma: PrismaService,
  private readonly notificationsGateway: NotificationsGateway,
) {}

  async createProject(
  ownerId: string,
  createProjectDto: CreateProjectDto,
) {
  return this.prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: ownerId },
    });

    if (!user) {
      throw new NotFoundException('Owner not found');
    }

    const { requiredSkills, ...projectData } = createProjectDto;

    const skills: { id: string; name: string }[] = [];

    for (const skillName of requiredSkills) {
      const skill = await tx.skill.upsert({
        where: {
          name: skillName,
        },
        update: {},
        create: {
          name: skillName,
        },
      });

      skills.push(skill);
    }

    const project = await tx.project.create({
  data: {
    ...projectData,
    ownerId,

    requiredSkills: {
      create: skills.map((skill) => ({
        skillId: skill.id,
      })),
    },
  },
  include: {
    owner: true,
    requiredSkills: {
      include: {
        skill: true,
      },
    },
  },
});

this.notificationsGateway.notifyProjectUpdate(
  project.id,
  {
    type: 'PROJECT_CREATED',
    project,
  },
);

return project;
  });
}
  async getAllProjects(status?: string) {
  return this.prisma.project.findMany({
    where: status
      ? {
          status,
        }
      : undefined,

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      requiredSkills: {
        include: {
          skill: true,
        },
      },
      _count: {
        select: {
          applications: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async getProjectById(projectId: string) {
  const project = await this.prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
        },
      },
      requiredSkills: {
        include: {
          skill: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      applications: {
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return project;
}
async getProjectMembers(projectId: string) {
  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return this.prisma.projectMember.findMany({
    where: {
      projectId,
    },
    include: {
      user: {
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
  });
}
async getCountryInfo(countryCode: string) {
  const response = await fetch(
    `https://countries.dev/alpha/${countryCode}`,
  );

  if (!response.ok) {
    throw new NotFoundException('Country not found');
  }

  return response.json();
}
}