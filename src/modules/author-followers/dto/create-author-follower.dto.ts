import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthorFollowerDto {
  @IsNotEmpty()
  @IsNumber()
  follower_id: number;

  @IsNotEmpty()
  @IsNumber()
  author_id: number;
}