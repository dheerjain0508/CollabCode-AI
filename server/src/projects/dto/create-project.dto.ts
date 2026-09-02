import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsInt()
  @Min(1)
  teamSize!: number;

  @IsArray()
  @IsString({ each: true })
  requiredSkills!: string[];
}