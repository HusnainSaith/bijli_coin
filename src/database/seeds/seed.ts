import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { RolePermission } from '../../modules/role-permissions/entities/role-permission.entity';
import { Role as RoleEnum } from '../../common/enums/role.enum';
import { dataSourceOptions } from '../../config/database.config';

const dataSource = new DataSource(dataSourceOptions);



async function seed() {
  try {
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const permissionRepo = dataSource.getRepository(Permission);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);

    // Create Super Admin role
    let superAdminRole = await roleRepo.findOne({ where: { slug: 'super_admin' } });
    if (!superAdminRole) {
      superAdminRole = await roleRepo.save({ name: 'Super Admin', slug: 'super_admin' });
    }

    // Assign ALL 165 permissions to Super Admin
    const allPermissions = await permissionRepo.find();
    const existingRolePermissions = await rolePermissionRepo.find({
      where: { role_id: superAdminRole.id }
    });
    const existingPermissionIds = existingRolePermissions.map(rp => rp.permission_id);
    
    const newRolePermissions = allPermissions
      .filter(p => !existingPermissionIds.includes(p.id))
      .map(p => ({ role_id: superAdminRole.id, permission_id: p.id }));
    
    if (newRolePermissions.length > 0) {
      await rolePermissionRepo.save(newRolePermissions);
      console.log(`Assigned ${newRolePermissions.length} permissions to Super Admin`);
    }

    // Create admin user
    const adminEmail = 'admin@example.com';
    const adminExists = await userRepo.findOne({ where: { email: adminEmail } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userRepo.save({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: RoleEnum.SUPER_ADMIN,
        role_id: superAdminRole.id,
        status: UserStatus.ACTIVE,
      });
      console.log('Admin created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  seed();
}