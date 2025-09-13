import { IsUUID, IsString } from 'class-validator';

export class CreateCommentReplyDto {
  @IsUUID()
  comment_id: string;

  @IsUUID()
  user_id: string;

  @IsString()
  content: string;
}
