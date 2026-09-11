import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAiAnalysisDto {
  @IsString()
  @MinLength(1)
  userId: string;

  @IsString()
  @MinLength(1)
  projectId: string;

  @IsString()
  @MinLength(1)
  jobTitle: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  @MinLength(1)
  summary: string;

  @IsArray()
  @IsString({ each: true })
  strengths: string[];

  @IsArray()
  @IsString({ each: true })
  missingSkills: string[];

  @IsObject()
  metadata: Record<string, unknown>;
}