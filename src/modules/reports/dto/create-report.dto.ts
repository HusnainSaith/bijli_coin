import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsNumber()
  reporter_id: number;

  @IsNotEmpty()
  @IsString()
  reportable_type: string;

  @IsNotEmpty()
  @IsNumber()
  reportable_id: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}