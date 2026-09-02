import { IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  message?: string;
}