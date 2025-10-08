import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post('assign')
  async assignPermissions(
    @Body() body: { role_id: string; permission_ids: string[] },
  ) {
    return this.rolePermissionsService.assignPermissionsToRole(
      body.role_id,
      body.permission_ids,
    );
  }

  @Put('update/:roleId')
  async updatePermissions(
    @Param('roleId') roleId: string,
    @Body() body: { permission_ids: string[] },
  ) {
    return this.rolePermissionsService.updatePermissionsOfRole(
      roleId,
      body.permission_ids,
    );
  }

  @Get('role/:roleId')
  async findByRole(@Param('roleId', ParseIntPipe) roleId: string) {
    return this.rolePermissionsService.findByRole(roleId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.rolePermissionsService.remove(id);
  }
}
