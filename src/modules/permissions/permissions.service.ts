import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RolePermission } from '../role-permissions/entities/role-permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(RolePermission) // ✅ inject
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    if (!id) {
      throw new BadRequestException('Invalid permission ID');
    }
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission not found with id: ${id}`);
    }
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    if (!id) throw new BadRequestException('Invalid permission ID');

    const result = await this.permissionRepository.update(
      id,
      updatePermissionDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Permission not found with id: ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('Invalid permission ID');

    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission not found with id: ${id}`);
    }
  }

  async getRoles(permissionId: string) {
    if (!permissionId) throw new BadRequestException('Invalid permission ID');
    // Later: join RolePermission table
    return [];
  }

  // async assignPermissionToRole(roleId: string, permissionId: string) {
  //   const rp = this.rolePermissionRepository.create({
  //     role: { id: roleId } as any,
  //     permission: { id: permissionId } as any,
  //   });
  //   return this.rolePermissionRepository.save(rp);
  // }

  // /** Update role's permissions (replace with new set) */
  // async updateRolePermissions(roleId: string, permissionIds: string[]) {
  //   // delete old
  //   await this.rolePermissionRepository.delete({ role: { id: roleId } as any });

  //   // insert new
  //   const newRelations = permissionIds.map((pid) =>
  //     this.rolePermissionRepository.create({
  //       role: { id: roleId } as any,
  //       permission: { id: pid } as any,
  //     }),
  //   );
  //   return this.rolePermissionRepository.save(newRelations);
  // }

  // /** Remove a permission from a role */
  // async removePermissionFromRole(roleId: string, permissionId: string) {
  //   const result = await this.rolePermissionRepository.delete({
  //     role: { id: roleId } as any,
  //     permission: { id: permissionId } as any,
  //   });

  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Permission ${permissionId} not found for role ${roleId}`);
  //   }

  //   return { success: true, message: 'Permission removed from role' };
  // }

  // /** Get all permissions of a role */
  // async getPermissionsOfRole(roleId: string) {
  //   return this.rolePermissionRepository.find({
  //     where: { role: { id: roleId } as any },
  //     relations: ['permission'],
  //   });
  // }
}
