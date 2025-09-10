import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { RolePermission } from '../role-permissions/entities/role-permission.entity';
import { RolePermissionsModule } from '../role-permissions/role-permissions.module';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Permission,RolePermission]),
RolePermissionsModule
],
  controllers: [PermissionsController],
  providers: [PermissionsService,PermissionsGuard],
   exports: [PermissionsService, PermissionsGuard],
})
export class PermissionsModule {}