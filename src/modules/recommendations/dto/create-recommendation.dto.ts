import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRecommendationDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  recommendable_type: string;

  @IsNotEmpty()
  @IsString()
  recommendable_id: string;

  @IsOptional()
  @IsString()
  score?: string;
}