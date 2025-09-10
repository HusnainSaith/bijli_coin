import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}