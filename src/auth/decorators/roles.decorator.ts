import { SetMetadata } from '@nestjs/common';
import type { RoleEnum } from '../../user/enums/role.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
