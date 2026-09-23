import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { AddSkillDto } from './dto/add-skill.dto';

@Controller('users/:userId/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addSkill(
    @Param('userId') userId: string,
    @Body() addSkillDto: AddSkillDto,
  ) {
    return this.skillsService.addSkill(userId, addSkillDto);
  }
}