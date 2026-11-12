import type { Request } from 'express';

/**
 * Express request enriched by AuthMiddleware with the id of the
 * authenticated user extracted from the `auth-user` JWT header.
 */
export interface RequestWithUserId extends Request {
    userId: number;
}
