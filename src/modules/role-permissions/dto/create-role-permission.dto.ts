import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRolePermissionDto {
  @IsNotEmpty()
  @IsNumber()
  role_id: string;

  @IsNotEmpty()
  @IsNumber()
  permission_id: string;
}