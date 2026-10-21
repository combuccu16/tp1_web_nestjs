import { Injectable } from '@nestjs/common';
export interface ApiEndpoint {
    readonly method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    readonly path: string;
    readonly description: string;
}
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
    getIndex(): ApiIndex {
        return {
            name: 'TP1 RT4 — Todo API',
            description: 'API REST de gestion de todos — NestJS + TypeORM + SQLite',
            version: '0.0.1',
            status: 'ok',
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
