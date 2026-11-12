import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import type { RequestWithUserId } from '../interfaces/request-with-user-id.interface.js';

const { verify } = jsonwebtoken;

/**
 * Simulated authentication: the client sends a JWT in the `auth-user`
 * header, we verify its signature and expose its `userId` on the request.
 *
 * This is a middleware (not a guard) on purpose: the exercise asks for a
 * simulated authentication that only needs `req`, `res` and `next`.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: RequestWithUserId, res: Response, next: NextFunction): void {
        const header = req.headers['auth-user'];
        const token = Array.isArray(header) ? header[0] : header;

        if (!token) {
            res.status(403).json({
                message: 'Access denied: the auth-user header is missing',
            });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(403).json({
                message: 'Access denied: JWT_SECRET is not configured',
            });
            return;
        }

        try {
            // verify() checks the signature (and expiration), unlike decode()
            // which would trust a forged token.
            const payload = verify(token, secret);
            if (typeof payload === 'string') {
                res.status(403).json({
                    message: 'Access denied: the auth-user token is invalid',
                });
                return;
            }

            const rawUserId = payload.userId;
            if (rawUserId === undefined || rawUserId === null || rawUserId === '') {
                res.status(403).json({
                    message: 'Access denied: the auth-user token has no userId',
                });
                return;
            }

            const userId = typeof rawUserId === 'number' ? rawUserId : Number(rawUserId);
            if (!Number.isInteger(userId)) {
                res.status(403).json({
                    message: 'Access denied: the auth-user token has an invalid userId',
                });
                return;
            }

            req.userId = userId;
            next();
        }
        catch {
            res.status(403).json({
                message: 'Access denied: the auth-user token is invalid or expired',
            });
        }
    }
}
