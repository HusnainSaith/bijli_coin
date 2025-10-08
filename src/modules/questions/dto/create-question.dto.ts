import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum QuestionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

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
  @IsString()
  category_id: string;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;
}
