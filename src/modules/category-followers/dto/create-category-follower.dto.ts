import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryFollowerDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;
}