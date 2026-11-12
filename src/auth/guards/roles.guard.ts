import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { RoleEnum } from '../../user/enums/role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles?.length) return true;
        const user = context.switchToHttp().getRequest().user as { role?: RoleEnum } | undefined;
        return !!user?.role && requiredRoles.includes(user.role);
    }
}
