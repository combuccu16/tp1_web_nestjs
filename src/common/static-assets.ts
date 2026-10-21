import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NestExpressApplication } from '@nestjs/platform-express';
export const STATIC_PREFIX = '/ui';
function resolvePublicDir(): string {
    const moduleDir = dirname(fileURLToPath(import.meta.url));
    const candidates = [
        join(process.cwd(), 'public'),
        join(moduleDir, '..', '..', 'public'),
    ];
    return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}
export function setupStaticAssets(app: NestExpressApplication): void {
    app.useStaticAssets(resolvePublicDir(), { prefix: STATIC_PREFIX });
}
