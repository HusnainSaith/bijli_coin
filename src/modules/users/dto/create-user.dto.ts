import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../../../common/enums/role.enum';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;


  @IsOptional()
  @IsEnum(Role)
  @Transform(({ value }) => value || 'user')
  role?: string = 'user';

  @IsUUID()
  @IsOptional()
  role_id?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @Transform(({ value }) => value || UserStatus.ACTIVE)
  status?: UserStatus = UserStatus.ACTIVE;
}