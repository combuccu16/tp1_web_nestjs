


const API_ROOT = '';


export class ApiError extends Error {
	
	constructor(message, status, messages) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.messages = messages;
	}
}


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
