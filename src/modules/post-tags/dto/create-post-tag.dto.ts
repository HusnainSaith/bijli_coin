import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostTagDto {
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  tag_id: string;
}
