import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Préfixe URL sous lequel le frontend statique est servi.
 *
 * L'API occupe la racine (`/todos`, `/todos/stats`, ...) : le frontend est
 * donc monté sur un préfixe dédié, pour que `GET /` reste l'index JSON de
 * l'API et que le tableau de bord soit accessible sur `/ui/`.
 */
export const STATIC_PREFIX = '/ui';

/**
 * Dossier des fichiers statiques (`public/`).
 *
 * Le projet est en ESM (`"type": "module"` dans package.json) : `__dirname`
 * n'existe donc pas, et l'emplacement du module est lu dans `import.meta.url`.
 *
 * Deux emplacements sont candidates :
 * - `<racine du projet>/public` : le cas normal, l'application étant lancée
 *   depuis la racine (`npm run start:dev`). C'est aussi là que `db.sqlite` est
 *   cherché par `data-source.ts` ;
 * - `<racine du projet>/public` déduit du chemin du module, qui reste correct
 *   que le fichier compilé soit dans `dist/common/` ou dans `src/common/`.
 */
function resolvePublicDir(): string {
	const moduleDir = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(process.cwd(), 'public'),
		join(moduleDir, '..', '..', 'public'),
	];
	return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

/**
 * Monte le frontend statique sur `/ui`.
 *
 * `useStaticAssets` enregistre le middleware `express.static` **avant** le
 * routeur de Nest : les fichiers de `public/` sont donc servis en premier,
 * et tout ce qui ne correspond pas à un fichier retombe sur l'API.
 *
 * Le `prefix` évite tout conflit avec la route `GET /` (l'index JSON).
 */
export function setupStaticAssets(app: NestExpressApplication): void {
	app.useStaticAssets(resolvePublicDir(), { prefix: STATIC_PREFIX });
}
