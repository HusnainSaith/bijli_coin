import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentReplyDto {
  @IsNotEmpty()
  @IsNumber()
  comment_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}