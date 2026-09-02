import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddSkillDto } from './dto/add-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async addSkill(userId: string, addSkillDto: AddSkillDto) {
    const { name, level } = addSkillDto;

    const skill = await this.prisma.skill.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });

    return this.prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
      update: {
        level,
      },
      create: {
        userId,
        skillId: skill.id,
        level,
      },
      include: {
        skill: true,
      },
    });
  }
}