import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
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
  @IsString()
  role?: string;

 
  
  @IsUUID()
  @IsOptional()
  role_id: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}