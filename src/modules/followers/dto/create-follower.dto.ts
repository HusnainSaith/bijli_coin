import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFollowerDto {
  @IsNotEmpty()
  @IsNumber()
  follower_id: number;

  @IsNotEmpty()
  @IsString()
  following_type: string;

  @IsNotEmpty()
  @IsNumber()
  following_id: number;
}