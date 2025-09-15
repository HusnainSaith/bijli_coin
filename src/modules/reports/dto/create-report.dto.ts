import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  reporter_id: string;

  @IsNotEmpty()
  @IsString()
  reportable_type: string;

  @IsNotEmpty()
  @IsString()
  reportable_id: string;

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