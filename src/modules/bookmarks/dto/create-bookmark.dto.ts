import { IsNotEmpty,  IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  post_id: string;
}