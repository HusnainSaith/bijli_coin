import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDraftDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  category_id?: string;
}
