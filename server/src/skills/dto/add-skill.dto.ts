import { IsString, IsNotEmpty } from 'class-validator';

export class AddSkillDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  level!: string;
}