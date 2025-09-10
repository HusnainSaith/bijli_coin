import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateViewDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  viewable_type: string;

  @IsNotEmpty()
  @IsNumber()
  viewable_id: number;

  @IsNotEmpty()
  @IsString()
  ip_address: string;
}