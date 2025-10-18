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

    return this.rolePermissionRepository.find({
      where: { permission_id: permissionId },
      relations: ['role'],
    });
  }
}
