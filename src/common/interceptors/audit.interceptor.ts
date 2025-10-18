import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role_id?: string;
    role?: string;
  };
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditLogsService: AuditLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip =
      request.ip ||
      request.socket?.remoteAddress ||
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
      'unknown';

    return next.handle().pipe(
      tap((result: unknown) => {
        void (async () => {
          try {
            let userId: string | undefined;

            // Get user ID from response only
            if (result && typeof result === 'object') {
              const res = result as Record<string, unknown>;
              if (
                res.user &&
                typeof res.user === 'object' &&
                'id' in res.user
              ) {
                userId = (res.user as { id: string }).id;
              } else if (res.data && typeof res.data === 'object') {
                const data = res.data as Record<string, unknown>;
                if (
                  data.user &&
                  typeof data.user === 'object' &&
                  'id' in data.user
                ) {
                  userId = (data.user as { id: string }).id;
                }
              } else if ('id' in res && auditOptions.resource === 'User') {
                userId = res.id as string;
              } else if ('user_id' in res) {
                userId = res.user_id as string;
              }
            }

            let auditableId: string | undefined;
            if (result && typeof result === 'object') {
              const res = result as Record<string, unknown>;
              if ('id' in res) {
                auditableId = res.id as string;
              } else if (
                res.user &&
                typeof res.user === 'object' &&
                'id' in res.user
              ) {
                auditableId = (res.user as { id: string }).id;
              }
            }
            if (!auditableId && request.params && 'id' in request.params) {
              auditableId = request.params.id;
            }

            await this.auditLogsService.create({
              user_id: userId,
              action: auditOptions.action,
              auditable_type: auditOptions.resource,
              auditable_id: auditableId,
              ip_address: ip,
            });
          } catch (error) {
            console.error('Audit log failed:', error);
          }
        })();
      }),
    );
  }
}
