import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

export class CreateReactionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  reactable_type: string;

  @IsNotEmpty()
  @IsString()
  reactable_id: string;

  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;
}