import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCategoryFollowerDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}