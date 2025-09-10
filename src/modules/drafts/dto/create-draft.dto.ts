import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDraftDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}