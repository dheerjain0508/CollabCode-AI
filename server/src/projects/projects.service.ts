import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(
    ownerId: string,
    createProjectDto: CreateProjectDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!user) {
      throw new NotFoundException('Owner not found');
    }

    const { requiredSkills, ...projectData } = createProjectDto;

    const skills = await Promise.all(
      requiredSkills.map(async (skillName) => {
        return this.prisma.skill.upsert({
          where: {
            name: skillName,
          },
          update: {},
          create: {
            name: skillName,
          },
        });
      }),
    );

    return this.prisma.project.create({
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
  }
  async getAllProjects() {
  return this.prisma.project.findMany({
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
}