import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMediaDto {
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  media_id: string;
}
