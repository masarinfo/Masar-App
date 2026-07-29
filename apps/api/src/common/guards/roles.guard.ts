import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@masar/types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { prisma } from '@masar/db';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const workspaceId = request.params.id || request.body.workspaceId;

    if (!userId || !workspaceId) {
      throw new ForbiddenException('معرف المستخدم أو مساحة العمل مفقود');
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('أنت لست عضواً في مساحة العمل هذه');
    }

    const hasRole = requiredRoles.includes(member.role as UserRole);
    if (!hasRole) {
      throw new ForbiddenException('ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء');
    }

    return true;
  }
}
