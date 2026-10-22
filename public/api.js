


const API_ROOT = '';


export class ApiError extends Error {

	constructor(message, status, messages) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.messages = messages;
	}
}


function absoluteUrl(path) {
	const base = globalThis.location?.href;
	return base ? new URL(path, base).href : path;
}


function unexpectedResponseMessage(status, contentType, isJson) {
	if (isJson) {
		return `L'API a répondu ${status} sans message.`;
	}
	const type = contentType ? ` (${contentType})` : '';
	return `Réponse ${status}${type} non-JSON : ce n'est pas l'API Todo. Vérifiez que le serveur est démarré sur le bon port.`;
}


async function request(path, { method = 'GET', body } = {}) {
	const options = { method, headers: { Accept: 'application/json' } };

	if (body !== undefined) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(body);
	}

	let response;
	try {
		response = await fetch(API_ROOT + path, options);
	} catch {
		throw new ApiError(
			`Aucune réponse de l'API sur ${absoluteUrl(path)}. Vérifiez que le serveur est démarré (npm run start:dev).`,
			0,
			[],
		);
	}

	const raw = response.status === 204 ? '' : await response.text();
	let payload = null;
	let isJson = true;

	if (raw) {
		try {
			payload = JSON.parse(raw);
		} catch {
			isJson = false;
		}
	}

	if (!response.ok) {
		const serverMessage = payload && payload.message;
		const messages = Array.isArray(serverMessage)
			? serverMessage
			: typeof serverMessage === 'string'
				? [serverMessage]
				: [];

		throw new ApiError(
			messages.length > 0
				? messages.join(' ')
				: unexpectedResponseMessage(
						response.status,
						response.headers.get('content-type'),
						isJson,
					),
			response.status,
			messages,
		);
	}

	if (raw && !isJson) {
		throw new ApiError(
			unexpectedResponseMessage(
				response.status,
				response.headers.get('content-type'),
				false,
			),
			response.status,
			[],
		);
	}

	return payload;
}


export const api = {
	
	list({ q = '', status = '', page = 1, limit = 10 } = {}) {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (status) params.set('status', status);
		params.set('page', String(page));
		params.set('limit', String(limit));
		return request(`/todos?${params.toString()}`);
	},

	
	stats() {
		return request('/todos/stats');
	},

	
	trash() {
		return request('/todos/trash');
	},

	
	create(todo) {
		return request('/todos', { method: 'POST', body: todo });
	},

	
	update(id, changes) {
		return request(`/todos/${id}`, { method: 'PATCH', body: changes });
	},

	
	remove(id) {
		return request(`/todos/${id}`, { method: 'DELETE' });
	},

	
	softDelete(id) {
		return request(`/todos/${id}/soft`, { method: 'DELETE' });
	},

	
	restore(id) {
		return request(`/todos/${id}/restore`, { method: 'POST' });
	},
};
