

import { ApiError, api } from './api.js';


const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];


const STATUS_LABELS = {
	TODO: 'à faire',
	IN_PROGRESS: 'en cours',
	DONE: 'terminé',
};


const PAGE_SIZE = 10;


const SEARCH_DELAY = 250;


const state = {
	todos: [],
	total: 0,
	page: 1,
	limit: PAGE_SIZE,
	q: '',
	status: '',
	stats: { total: 0, byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 } },
	trash: [],
	editing: null,
};



const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));


function formatDate(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}


function el(tag, attributes = {}, children = []) {
	const node = document.createElement(tag);
	for (const [name, value] of Object.entries(attributes)) {
		if (value === false || value === null || value === undefined) continue;
		if (name === 'class') node.className = value;
		else if (name === 'text') node.textContent = value;
		else node.setAttribute(name, value);
	}
	for (const child of children) node.append(child);
	return node;
}




function toast(message, tone = 'info') {
	const node = el('div', { class: `toast toast--${tone}`, text: message });
	$('[data-toasts]').append(node);
	setTimeout(() => node.remove(), 4200);
}




function renderBoard() {
	for (const status of STATUSES) {
		const lane = $(`.lane[data-lane="${status}"]`);
		const list = $('[data-lane-list]', lane);
		const empty = $('[data-lane-empty]', lane);
		const todos = state.todos.filter((todo) => todo.status === status);

		list.replaceChildren(...todos.map(renderEntry));
		$('[data-lane-count]', lane).textContent = String(todos.length);
		empty.hidden = todos.length > 0;
	}
}


function renderEntry(todo) {
	const entry = el('li', { class: 'entry', draggable: 'true', 'data-id': todo.id });

	const actions = el('div', { class: 'entry__actions' }, [
		el('button', {
			class: 'entry__action',
			type: 'button',
			'data-action': 'edit',
			text: 'Modifier',
			'aria-label': `Modifier ${todo.name}`,
		}),
		el('button', {
			class: 'entry__action',
			type: 'button',
			'data-action': 'soft-delete',
			text: 'Supprimer',
			'aria-label': `Supprimer ${todo.name}`,
		}),
		el('button', {
			class: 'entry__action entry__action--danger',
			type: 'button',
			'data-action': 'delete',
			text: 'Effacer',
			'aria-label': `Effacer définitivement ${todo.name}`,
		}),
	]);

	entry.append(
		el('p', { class: 'entry__name', text: todo.name }),
		el('p', { class: 'entry__description', text: todo.description }),
		el('div', { class: 'entry__meta' }, [
			el('span', { text: `#${todo.id}` }),
			el('span', { text: `créé le ${formatDate(todo.createdAt)}` }),
		]),
		actions,
	);

	return entry;
}


function renderOverview() {
	const { byStatus, total } = state.stats;
	const share = (value) => (total > 0 ? (value / total) * 100 : 0);

	$('.overview__segment--todo').style.width = `${share(byStatus.TODO)}%`;
	$('.overview__segment--progress').style.width = `${share(byStatus.IN_PROGRESS)}%`;
	$('.overview__segment--done').style.width = `${share(byStatus.DONE)}%`;

	$('[data-total]').textContent = String(total);
	for (const status of STATUSES) {
		$(`[data-legend="${status}"]`).textContent = String(byStatus[status]);
	}
}


function renderPager() {
	const pages = Math.max(1, Math.ceil(state.total / state.limit));
	const label = state.total === 0 ? 'Aucun todo' : `${state.total} todo${state.total > 1 ? 's' : ''}`;

	$('[data-page-status]').textContent = `${label} — page ${state.page} sur ${pages}`;
	$('#prev-page').disabled = state.page <= 1;
	$('#next-page').disabled = state.page >= pages;
}


function renderTrash() {
	const section = $('[data-trash]');
	section.hidden = state.trash.length === 0;
	$('[data-trash-count]').textContent = String(state.trash.length);

	$('[data-trash-list]').replaceChildren(
		...state.trash.map((todo) =>
			el('li', { class: 'trash__item' }, [
				el('div', {}, [
					el('p', { class: 'trash__name', text: todo.name }),
					el('p', {
						class: 'trash__meta',
						text: `#${todo.id} — supprimé le ${formatDate(todo.deletedAt)}`,
					}),
				]),
				el('button', {
					class: 'entry__action',
					type: 'button',
					'data-action': 'restore',
					'data-id': todo.id,
					text: 'Restaurer',
				}),
			]),
		),
	);
}




async function refresh() {
	try {
		const [list, stats, trash] = await Promise.all([
			api.list({ q: state.q, status: state.status, page: state.page, limit: state.limit }),
			api.stats(),
			api.trash(),
		]);

		state.todos = list.data;
		state.total = list.total;
		state.stats = stats;
		state.trash = trash;

		renderBoard();
		renderOverview();
		renderPager();
		renderTrash();
	} catch (error) {
		reportError(error);
	}
}


function reportError(error) {
	if (error instanceof ApiError) {
		toast(error.messages.join(' ') || error.message, 'error');
	} else {
		toast("L'API n'a pas répondu.", 'error');
	}
}




function openDrawer(todo = null) {
	state.editing = todo;
	const form = $('[data-form]');

	$('#drawer-title').textContent = todo ? 'Modifier le todo' : 'Nouveau todo';
	$('#field-name').value = todo ? todo.name : '';
	$('#field-description').value = todo ? todo.description : '';
	$('#field-status').value = todo ? todo.status : 'TODO';
	$('[data-status-field]').hidden = !todo;
	$('[data-form-error]').hidden = true;

	$('[data-drawer]').hidden = false;
	$('[data-scrim]').hidden = false;
	document.body.style.overflow = 'hidden';
	$('#field-name').focus();
}


function closeDrawer() {
	$('[data-drawer]').hidden = true;
	$('[data-scrim]').hidden = true;
	document.body.style.overflow = '';
	state.editing = null;
}


function showFormError(messages) {
	const box = $('[data-form-error]');
	box.replaceChildren(...messages.map((message) => el('p', { text: message })));
	box.hidden = false;
}


async function submitForm(event) {
	event.preventDefault();

	const form = $('[data-form]');
	const name = $('#field-name').value.trim();
	const description = $('#field-description').value.trim();
	const todo = state.editing;

	const button = $('[data-submit]');
	button.disabled = true;

	try {
		if (todo) {
			const changes = { name, description, status: $('#field-status').value };
			await api.update(todo.id, changes);
			toast(`« ${name} » mis à jour.`, 'success');
		} else {
			await api.create({ name, description });
			toast(`« ${name} » ajouté.`, 'success');
		}

		closeDrawer();
		await refresh();
	} catch (error) {
		if (error instanceof ApiError && error.messages.length > 0) {
			showFormError(error.messages);
		} else {
			showFormError(["L'API n'a pas répondu."]);
		}
	} finally {
		button.disabled = false;
	}
}




async function moveTodo(id, status) {
	const todo = state.todos.find((item) => item.id === id);
	if (!todo || todo.status === status) return;

	try {
		await api.update(id, { status });
		toast(`« ${todo.name} » est maintenant ${STATUS_LABELS[status]}.`, 'success');
	} catch (error) {
		reportError(error);
	}
	await refresh();
}


async function deleteTodo(id) {
	const todo = state.todos.find((item) => item.id === id);
	if (!todo) return;

	if (!window.confirm(`Effacer définitivement « ${todo.name} » ?`)) return;

	try {
		await api.remove(id);
		toast(`« ${todo.name} » effacé.`, 'success');
	} catch (error) {
		reportError(error);
	}
	await refresh();
}


async function softDeleteTodo(id) {
	const todo = state.todos.find((item) => item.id === id);
	if (!todo) return;

	try {
		await api.softDelete(id);
		toast(`« ${todo.name} » déplacé dans la corbeille.`, 'success');
	} catch (error) {
		reportError(error);
	}
	await refresh();
}


async function restoreTodo(id) {
	try {
		await api.restore(id);
		toast('Todo restauré.', 'success');
	} catch (error) {
		reportError(error);
	}
	await refresh();
}



function wireEvents() {
	
	$('#new-todo').addEventListener('click', () => openDrawer());

	
	$$('[data-close]').forEach((button) => button.addEventListener('click', closeDrawer));
	$('[data-scrim]').addEventListener('click', closeDrawer);
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !$('[data-drawer]').hidden) closeDrawer();
	});

	
	$('[data-form]').addEventListener('submit', submitForm);

	
	let searchTimer;
	$('#search').addEventListener('input', (event) => {
		clearTimeout(searchTimer);
		const value = event.target.value;
		searchTimer = setTimeout(() => {
			state.q = value;
			state.page = 1;
			refresh();
		}, SEARCH_DELAY);
	});

	$('#status').addEventListener('change', (event) => {
		state.status = event.target.value;
		state.page = 1;
		refresh();
	});

	
	$('#prev-page').addEventListener('click', () => {
		if (state.page > 1) {
			state.page -= 1;
			refresh();
		}
	});
	$('#next-page').addEventListener('click', () => {
		state.page += 1;
		refresh();
	});

	
	document.addEventListener('click', (event) => {
		const button = event.target.closest('[data-action]');
		if (!button) return;

		const id = Number(button.dataset.id ?? button.closest('[data-id]')?.dataset.id);
		switch (button.dataset.action) {
			case 'edit':
				openDrawer(state.todos.find((todo) => todo.id === id));
				break;
			case 'soft-delete':
				softDeleteTodo(id);
				break;
			case 'delete':
				deleteTodo(id);
				break;
			case 'restore':
				restoreTodo(id);
				break;
		}
	});

	
	let draggedId = null;

	document.addEventListener('dragstart', (event) => {
		const entry = event.target.closest('.entry');
		if (!entry) return;
		draggedId = Number(entry.dataset.id);
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', String(draggedId));
		entry.classList.add('is-dragging');
	});

	document.addEventListener('dragend', (event) => {
		const entry = event.target.closest('.entry');
		if (entry) entry.classList.remove('is-dragging');
		$$('.lane').forEach((lane) => lane.classList.remove('is-over'));
		draggedId = null;
	});

	$$('.lane').forEach((lane) => {
		lane.addEventListener('dragover', (event) => {
			if (draggedId === null) return;
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
			lane.classList.add('is-over');
		});

		lane.addEventListener('dragleave', (event) => {
			if (!lane.contains(event.relatedTarget)) lane.classList.remove('is-over');
		});

		lane.addEventListener('drop', (event) => {
			event.preventDefault();
			lane.classList.remove('is-over');
			const id = Number(event.dataTransfer.getData('text/plain')) || draggedId;
			if (id) moveTodo(id, lane.dataset.lane);
		});
	});
}



wireEvents();
refresh();
