import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  auditable_type?: string;

  @IsOptional()
  @IsString()
  auditable_id?: string;

  @IsOptional()
  @IsString()
  ip_address?: string;
}
