import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum QuestionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;
}