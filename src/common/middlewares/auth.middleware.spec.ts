import type { NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import type { RequestWithUserId } from '../interfaces/request-with-user-id.interface.js';
import { AuthMiddleware } from './auth.middleware.js';

const { sign } = jsonwebtoken;
const SECRET = 'auth-middleware-test-secret';

interface MockResponse {
    statusCode?: number;
    body?: unknown;
    status: (code: number) => MockResponse;
    json: (payload: unknown) => MockResponse;
}

function createResponse(): MockResponse {
    return {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };
}

describe('AuthMiddleware', () => {
    let middleware: AuthMiddleware;
    let next: NextFunction;
    let res: MockResponse;

    beforeEach(() => {
        process.env.JWT_SECRET = SECRET;
        middleware = new AuthMiddleware();
        next = vi.fn();
        res = createResponse();
    });

    afterAll(() => {
        delete process.env.JWT_SECRET;
    });

    function run(token?: string): RequestWithUserId {
        const req = { headers: token ? { 'auth-user': token } : {} } as RequestWithUserId;
        middleware.use(req, res as never, next);
        return req;
    }

    it('rejects a request without the auth-user header', () => {
        run();
        expect(res.statusCode).toBe(403);
        expect(res.body).toMatchObject({ message: expect.stringContaining('missing') });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a forged or malformed token', () => {
        run('not.a.jwt');
        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a token signed with another secret', () => {
        run(sign({ userId: 5 }, 'wrong-secret', { expiresIn: '1h' }));
        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a valid token that has no userId', () => {
        run(sign({ name: 'no-user' }, SECRET, { expiresIn: '1h' }));
        expect(res.statusCode).toBe(403);
        expect(res.body).toMatchObject({ message: expect.stringContaining('no userId') });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects an expired token', () => {
        run(sign({ userId: 5 }, SECRET, { expiresIn: -10 }));
        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('exposes userId and calls next for a valid token', () => {
        const req = run(sign({ userId: 5 }, SECRET, { expiresIn: '1h' }));
        expect(req.userId).toBe(5);
        expect(res.statusCode).toBeUndefined();
        expect(next).toHaveBeenCalledOnce();
    });
});
