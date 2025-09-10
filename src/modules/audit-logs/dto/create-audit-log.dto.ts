import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  auditable_type?: string;

  @IsOptional()
  @IsNumber()
  auditable_id?: number;

  @IsOptional()
  @IsString()
  ip_address?: string;
}