import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
  if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    throw new BadRequestException('Invalid roleId or permissionIds');
  }

  const rolePermissions = permissionIds.map((pid) =>
    this.rolePermissionRepository.create({ role_id: roleId, permission_id: pid }),
  );

  return this.rolePermissionRepository.save(rolePermissions);
}

async updatePermissionsOfRole(roleId: string, permissionIds: string[]) {
  if (!roleId) {
    throw new BadRequestException('Invalid roleId');
  }

  // First delete existing role-permission mappings
  await this.rolePermissionRepository.delete({ role_id: roleId });

  // Now insert new mappings
  const rolePermissions = permissionIds.map((pid) =>
    this.rolePermissionRepository.create({ role_id: roleId, permission_id: pid }),
  );

  return this.rolePermissionRepository.save(rolePermissions);
}


async findByRole(roleId: string): Promise<RolePermission[]> {
  if (!roleId) {
    throw new BadRequestException('Invalid role ID');
  }
  return this.rolePermissionRepository.find({
    where: { role_id: roleId }, // ✅ UUID
    relations: ['permission'],
  });
}

  async remove(id: string): Promise<void> {
    const result = await this.rolePermissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role permission relationship not found');
    }
  }
}