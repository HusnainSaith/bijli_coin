import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRecommendationDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  recommendable_type: string;

  @IsNotEmpty()
  @IsNumber()
  recommendable_id: number;

  @IsOptional()
  @IsNumber()
  score?: number;
}