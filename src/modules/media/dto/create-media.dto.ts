import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  file_path: string;

  @IsNotEmpty()
  @IsString()
  file_url: string;

  @IsNotEmpty()
  @IsString()
  mime_type: string;

  @IsNotEmpty()
  @IsNumber()
  file_size: number;
}