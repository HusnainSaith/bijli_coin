import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

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
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  reactable_type: string;

  @IsNotEmpty()
  @IsNumber()
  reactable_id: number;

  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;
}