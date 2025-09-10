import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RolePermissionsService } from 'src/modules/role-permissions/role-permissions.service';

@Injectable()
export class AutoPermissionsGuard implements CanActivate {
  constructor(
    private rolePermissionsService: RolePermissionsService,
  ) {}

  private getRequiredPermission(method: string, path: string): string | null {
    // Map HTTP method + path to required permission
    const routeMap: Record<string, string> = {
      // Users
      'GET:/users': 'read_user',
      'POST:/users': 'create_user',
      'PATCH:/users': 'update_user',
      'DELETE:/users': 'delete_user',
      
      // Roles
      'GET:/roles': 'read_role',
      'POST:/roles': 'create_role',
      'PATCH:/roles': 'update_role',
      'DELETE:/roles': 'delete_role',
      
      // Permissions
      'GET:/permissions': 'read_permission',
      'POST:/permissions': 'create_permission',
      'PATCH:/permissions': 'update_permission',
      'DELETE:/permissions': 'delete_permission',
      
      // Posts
      'GET:/posts': 'read_post',
      'POST:/posts': 'create_post',
      'PATCH:/posts': 'update_post',
      'DELETE:/posts': 'delete_post',
      
      // Categories
      'GET:/categories': 'read_category',
      'POST:/categories': 'create_category',
      'PATCH:/categories': 'update_category',
      'DELETE:/categories': 'delete_category',
      
      // Comments
      'GET:/comments': 'read_comment',
      'POST:/comments': 'create_comment',
      'PATCH:/comments': 'update_comment',
      'DELETE:/comments': 'delete_comment',
    };

    const key = `${method}:${path}`;
    return routeMap[key] || null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || request.url.split('?')[0];
    
    // Skip permission check for auth routes
    if (path.startsWith('/auth')) {
      return true;
    }

    const user = request.user;
    if (!user || !user.role_id) {
      throw new ForbiddenException('User role not found');
    }

    const method = request.method;
    const requiredPermission = this.getRequiredPermission(method, path);
    
    // If no permission required for this route, allow access
    if (!requiredPermission) {
      return true;
    }

    // Get user permissions
    const rolePermissions = await this.rolePermissionsService.findByRole(user.role_id);
    const userPermissions = rolePermissions.map(rp => rp.permission.slug);

    // Check if user has required permission
    if (!userPermissions.includes(requiredPermission)) {
      throw new ForbiddenException(
        `Access denied. Required permission: ${requiredPermission}`
      );
    }

    return true;
  }
}