import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowerDto {
  @IsNotEmpty()
  @IsString()
  follower_id: string;

  @IsNotEmpty()
  @IsString()
  following_type: string;

  @IsNotEmpty()
  @IsString()
  following_id: string;
}