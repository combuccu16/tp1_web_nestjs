import type { RoleEnum } from '../../user/enums/role.enum.js';

export interface JwtPayload {
    sub: number;
    username: string;
    role: RoleEnum;
}
