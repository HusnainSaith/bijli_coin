import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateTrackingDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  event_name: string;

  @IsNotEmpty()
  @IsString()
  event_type: string;

  @IsOptional()
  @IsString()
  ip_address?: string;
}