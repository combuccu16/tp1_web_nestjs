import { Injectable } from '@nestjs/common';

/**
 * Une entrée de l'index public de l'API.
 *
 * `method` est volontairement restreint aux quatre verbes HTTP réellement
 * utilisés par l'application : le type garantit qu'aucune route ne peut
 * être annoncée avec un verbe inconnu.
 */
export interface ApiEndpoint {
	readonly method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	readonly path: string;
	readonly description: string;
}

/**
 * Le contenu renvoyé par `GET /` : l'index de l'application.
 */
export interface ApiIndex {
	readonly name: string;
	readonly description: string;
	readonly version: string;
	readonly status: 'ok';
	readonly ui: string;
	readonly stack: {
		readonly framework: string;
		readonly orm: string;
		readonly database: string;
	};
	readonly endpoints: readonly ApiEndpoint[];
}

/**
 * Surface publique de l'API, dans l'ordre de déclaration des routes.
 *
 * ⚠️ Cet ordre est celui du routage Express : les routes littérales
 * (`/todos/stats`) doivent précéder les routes paramétrées (`/todos/:id`).
 * La liste est donc alignée sur `src/todo/todo.controller.ts`.
 */
const API_ENDPOINTS: readonly ApiEndpoint[] = [
	{
		method: 'GET',
		path: '/test-injection/uuid',
		description: "Démonstration de l'injection de dépendances (partie 1)",
	},
	{
		method: 'GET',
		path: '/todos',
		description: 'Liste paginée des todos (q, status, page, limit)',
	},
	{
		method: 'GET',
		path: '/todos/stats',
		description: 'Statistiques par statut (COUNT + GROUP BY, requête unique)',
	},
	{
		method: 'GET',
		path: '/todos/trash',
		description: 'Todos supprimés logiquement, prêts à être restaurés',
	},
	{
		method: 'GET',
		path: '/todos/:id',
		description: "Détail d'un todo — 404 si inexistant",
	},
	{
		method: 'POST',
		path: '/todos',
		description: "Création d'un todo — 201 Created",
	},
	{
		method: 'PATCH',
		path: '/todos/:id',
		description: 'Mise à jour partielle (DTO partiel, aucun champ obligatoire)',
	},
	{
		method: 'DELETE',
		path: '/todos/:id',
		description: 'Suppression définitive',
	},
	{
		method: 'DELETE',
		path: '/todos/:id/soft',
		description: 'Suppression logique (deletedAt)',
	},
	{
		method: 'POST',
		path: '/todos/:id/restore',
		description: "Restauration d'un todo supprimé logiquement",
	},
];

@Injectable()
export class AppService {
	/**
	 * Construit l'index de l'API renvoyé par `GET /`.
	 *
	 * L'index est **statique** : il décrit la surface publique de
	 * l'application. Il est maintenu à la main plutôt que dérivé
	 * dynamiquement, car les routes sont déclarées par les contrôleurs
	 * NestJS (`@Get`, `@Post`, ...) et ne sont pas introspectables de façon
	 * simple depuis le code applicatif.
	 */
	getIndex(): ApiIndex {
		return {
			name: 'TP1 RT4 — Todo API',
			description: 'API REST de gestion de todos — NestJS + TypeORM + SQLite',
			version: '0.0.1', // synchronisé avec la version de package.json
			status: 'ok',
			// Le tableau de bord statique, servi par l'API elle-même.
			ui: '/ui/',
			stack: {
				framework: 'NestJS',
				orm: 'TypeORM',
				database: 'SQLite',
			},
			endpoints: API_ENDPOINTS,
		};
	}
}
