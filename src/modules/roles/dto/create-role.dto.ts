import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: Role;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
