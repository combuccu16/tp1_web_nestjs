/**
 * Client HTTP de l'API Todo.
 *
 * Ce module ne contient **aucune** manipulation du DOM : il ne fait que
 * parler à l'API et traduire ses réponses (ou ses erreurs) en objets.
 * L'interface, elle, ne fait **aucun** appel à `fetch`.
 *
 * L'API et le frontend sont servis par le même processus et la même
 * origine (`http://localhost:3000`), donc les URL sont relatives : aucune
 * configuration CORS n'est nécessaire.
 */

/**
 * Racine de l'API : le frontend est monté sur `/ui`, l'API occupe la racine.
 *
 * La racine est **vide** et non `/` : concaténée à un chemin déjà absolu
 * (`/todos/...`), elle doit donner `/todos/...` et non `//todos/...` — que le
 * navigateur interpréterait comme une URL relative au protocole, et donc
 * comme l'hôte « todos ».
 *
 * Les requêtes sont ainsi relatives à l'origine courante : l'API et le
 * frontend étant servis par le même processus, aucune configuration CORS
 * n'est nécessaire.
 */
const API_ROOT = '';

/**
 * Erreur renvoyée par l'API.
 *
 * `messages` contient les messages du serveur tels quels — pour une
 * validation, ce sont les messages personnalisés de `VALIDATION_MESSAGES`
 * (parties 3 de l'énoncé), affichés tels quels dans l'interface.
 */
export class ApiError extends Error {
	/**
	 * @param {string} message message unique, prêt à afficher
	 * @param {number} status code HTTP
	 * @param {string[]} messages tous les messages renvoyés par l'API
	 */
	constructor(message, status, messages) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.messages = messages;
	}
}

/**
 * Effectue une requête et renvoie le corps de la réponse.
 *
 * @param {string} path chemin de l'API, préfixé par `/`
 * @param {{method?: string, body?: unknown}} [options]
 * @returns {Promise<any>}
 */
async function request(path, { method = 'GET', body } = {}) {
	const options = { method, headers: { Accept: 'application/json' } };

	if (body !== undefined) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(body);
	}

	const response = await fetch(API_ROOT + path, options);
	const payload = response.status === 204 ? null : await response.json().catch(() => null);

	if (!response.ok) {
		const raw = payload && payload.message;
		const messages = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : [];
		throw new ApiError(
			messages.join(' ') || `Erreur ${response.status}`,
			response.status,
			messages,
		);
	}

	return payload;
}

/** Interface de l'API, une fonction par endpoint. */
export const api = {
	/**
	 * Liste paginée des todos actifs.
	 *
	 * @param {{q?: string, status?: string, page?: number, limit?: number}} [filters]
	 */
	list({ q = '', status = '', page = 1, limit = 10 } = {}) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (status) params.set('status', status);
		params.set('page', String(page));
		params.set('limit', String(limit));
		return request(`/todos?${params.toString()}`);
	},

	/** Statistiques par statut (partie 7) : une seule requête SQL. */
	stats() {
		return request('/todos/stats');
	},

	/** Todos supprimés logiquement, prêts à être restaurés. */
	trash() {
		return request('/todos/trash');
	},

	/** Crée un todo. La réponse est l'entité complète, code 201. */
	create(todo) {
		return request('/todos', { method: 'POST', body: todo });
	},

	/** Met à jour un todo (partiel). La réponse est l'entité mise à jour. */
	update(id, changes) {
		return request(`/todos/${id}`, { method: 'PATCH', body: changes });
	},

	/** Suppression définitive. */
	remove(id) {
		return request(`/todos/${id}`, { method: 'DELETE' });
	},

	/** Suppression logique : la ligne reste en base, marquée `deletedAt`. */
	softDelete(id) {
		return request(`/todos/${id}/soft`, { method: 'DELETE' });
	},

	/** Restaure un todo supprimé logiquement. */
	restore(id) {
		return request(`/todos/${id}/restore`, { method: 'POST' });
	},
};
