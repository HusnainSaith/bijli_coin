import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostMediaDto {
  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  @IsNotEmpty()
  @IsNumber()
  media_id: number;
}