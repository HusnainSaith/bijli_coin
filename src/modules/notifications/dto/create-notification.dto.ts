import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @IsOptional()
  @IsEmail()
  userEmail?: string;
}