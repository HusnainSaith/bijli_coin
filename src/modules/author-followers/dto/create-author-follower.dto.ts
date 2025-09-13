import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorFollowerDto {
  @IsNotEmpty()
  @IsString()
  follower_id: string;

  @IsNotEmpty()
  @IsString()
  author_id: string;
}