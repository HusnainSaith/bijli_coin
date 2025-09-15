import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  question_id: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  is_accepted?: boolean;
}