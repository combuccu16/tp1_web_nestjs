import { Controller, Get } from '@nestjs/common';
// `import type` obligatoire : `ApiIndex` est un type référencé dans une
// signature décorée, et `isolatedModules` + `emitDecoratorMetadata` sont
// activés (TS1272).
import type { ApiIndex } from './app.service.js';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * `GET /` — index de l'API.
	 *
	 * Remplace le message d'accueil du scaffold `nest new` par une
	 * description réelle de l'application et de sa surface publique.
	 * La réponse est sérialisée en JSON par NestJS.
	 */
	@Get()
	getIndex(): ApiIndex {
		return this.appService.getIndex();
	}
}
