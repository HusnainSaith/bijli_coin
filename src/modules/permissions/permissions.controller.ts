import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionsService.create(createPermissionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Get(':id/roles')
  async getRoles(@Param('id') id: string) {
    return this.permissionsService.getRoles(id);
  }

  // @Post('assign')
  // async assignPermission(@Body() body: { roleId: string; permissionId: string }) {
  //   return this.permissionsService.assignPermissionToRole(body.roleId, body.permissionId);
  // }

  // /** Update a role’s permissions (replace set) */
  // @Patch('update-role-permissions/:roleId')
  // async updateRolePermissions(
  //   @Param('roleId') roleId: string,
  //   @Body() body: { permissionIds: string[] },
  // ) {
  //   return this.permissionsService.updateRolePermissions(roleId, body.permissionIds);
  // }

  // /** Remove a permission from a role */
  // @Delete(':roleId/:permissionId')
  // async removePermissionFromRole(
  //   @Param('roleId') roleId: string,
  //   @Param('permissionId') permissionId: string,
  // ) {
  //   return this.permissionsService.removePermissionFromRole(roleId, permissionId);
  // }

  // /** Get all permissions of a role */
  // @Get('role/:roleId')
  // async getPermissionsOfRole(@Param('roleId') roleId: string) {
  //   return this.permissionsService.getPermissionsOfRole(roleId);
  // }
}
