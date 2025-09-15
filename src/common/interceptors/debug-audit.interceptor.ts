import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';

@Injectable()
export class DebugAuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditLogsService: AuditLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get<AuditOptions>(AUDIT_KEY, context.getHandler());
    
    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = request.ip || request.connection.remoteAddress;
    
    console.log('=== DEBUG AUDIT INTERCEPTOR ===');
    console.log('Route:', request.route?.path || request.url);
    console.log('Method:', request.method);
    console.log('Headers Authorization:', request.headers.authorization ? 'Present' : 'Missing');
    console.log('Request User Object:', JSON.stringify(user, null, 2));
    console.log('User ID from user.id:', user?.id);
    console.log('User ID from user.sub:', user?.sub);
    console.log('================================');

    return next.handle().pipe(
      tap(async (result) => {
        try {
          const userId = user?.id || user?.sub || null;
          
          const auditData = {
            user_id: userId,
            action: auditOptions.action,
            auditable_type: auditOptions.resource,
            auditable_id: result?.id || request.params?.id,
            ip_address: ip,
          };
          
          console.log('Saving audit data:', auditData);
          await this.auditLogsService.create(auditData);
          console.log('Audit log saved successfully');
        } catch (error) {
          console.error('Audit log failed:', error);
        }
      }),
    );
  }
}