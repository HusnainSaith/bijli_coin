import { IsEmail, IsNotEmpty, IsString, MinLength, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { UserStatus } from 'src/modules/users/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsUUID()
  @IsOptional()
  role_id?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
