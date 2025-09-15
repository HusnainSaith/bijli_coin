import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
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
    const ip = request.ip || request.connection.remoteAddress || request.headers['x-forwarded-for'];
    const isAuthRoute = request.route?.path?.startsWith('/auth') || request.url.startsWith('/auth');

    return next.handle().pipe(
      tap(async (result) => {
        try {
          let userId = null;
          
          // Get user ID from response only
          if (result?.user?.id) {
            userId = result.user.id;
          } else if (result?.data?.user?.id) {
            userId = result.data.user.id;
          } else if (result?.id && auditOptions.resource === 'User') {
            userId = result.id;
          } else if (result?.user_id) {
            userId = result.user_id;
          }
          
          await this.auditLogsService.create({
            user_id: userId,
            action: auditOptions.action,
            auditable_type: auditOptions.resource,
            auditable_id: result?.id || result?.user?.id || request.params?.id,
            ip_address: ip,
          });
        } catch (error) {
          console.error('Audit log failed:', error);
        }
      }),
    );
  }
}