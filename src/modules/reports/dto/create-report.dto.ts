import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import e from 'express';

export enum ReportStatus_enum {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum reason_enum {
  SPAM = 'spam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  HARASSMENT = 'harassment',
  OTHER = 'other',
}
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
  @IsEnum(reason_enum)
  reason: (reason_enum)

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ReportStatus_enum)
  status?: ReportStatus_enum = ReportStatus_enum.PENDING;
}
