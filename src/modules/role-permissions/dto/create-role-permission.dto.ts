import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRolePermissionDto {
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsNotEmpty()
  @IsString()
  permission_id: string;
}
