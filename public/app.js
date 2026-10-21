/**
 * Tableau de bord du Todo board.
 *
 * Ce module ne fait **jamais** d'appel réseau lui-même : il passe par
 * `api.js`. Il tient l'état de l'interface, redessine le board et relaie
 * les actions de l'utilisateur.
 *
 * Le board est un tableau à trois colonnes — TODO, IN_PROGRESS, DONE —
 * parce que les trois statuts de `StatusEnum` *sont* trois colonnes. Les
 * todos d'une page sont répartis entre les colonnes selon leur statut.
 */

import { ApiError, api } from './api.js';

/** Les trois statuts, dans l'ordre d'affichage. */
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

/** Libellés lisibles, utilisés pour les messages de l'interface. */
const STATUS_LABELS = {
	TODO: 'à faire',
	IN_PROGRESS: 'en cours',
	DONE: 'terminé',
};

/** Nombre de todos affichés par page. */
const PAGE_SIZE = 10;

/** Délai avant de relancer une recherche (évite une requête par frappe). */
const SEARCH_DELAY = 250;

/**
 * État de l'interface.
 *
 * `todos` ne contient que la page courante ; `total` le nombre de todos
 * correspondant aux filtres (tous statuts confondus) ; `stats` la
 * répartition globale, qui ignore les filtres.
 */
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

/* ------------------------------------------------------------------- outils */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/** Formate une date ISO en date lisible, en heure locale. */
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

/** Crée un élément avec ses attributs et ses enfants. */
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

/* ------------------------------------------------------------------ toasts */

/**
 * Affiche un message temporaire en bas de l'écran.
 *
 * @param {string} message
 * @param {'success'|'error'|'info'} [tone]
 */
function toast(message, tone = 'info') {
	const node = el('div', { class: `toast toast--${tone}`, text: message });
	$('[data-toasts]').append(node);
	setTimeout(() => node.remove(), 4200);
}

/* ------------------------------------------------------------- rendu global */

/** Redessine le tableau de bord : les trois colonnes. */
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

/**
 * Construit une ligne de todo.
 *
 * @param {object} todo
 * @returns {HTMLElement}
 */
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

/** Redessine la répartition globale (barre segmentée + légende). */
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

/** Redessine la pagination. */
function renderPager() {
	const pages = Math.max(1, Math.ceil(state.total / state.limit));
	const label = state.total === 0 ? 'Aucun todo' : `${state.total} todo${state.total > 1 ? 's' : ''}`;

	$('[data-page-status]').textContent = `${label} — page ${state.page} sur ${pages}`;
	$('#prev-page').disabled = state.page <= 1;
	$('#next-page').disabled = state.page >= pages;
}

/** Redessine la corbeille (todos supprimés logiquement). */
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

/* ------------------------------------------------------------------ chargements */

/**
 * Recharge tout ce qui dépend de l'API.
 *
 * Les statistiques et la corbeille ignorent les filtres de recherche : la
 * barre de répartition décrit la base entière, et la corbeille n'a pas
 * vocation à être filtrée.
 */
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

/** Traduit une erreur en message affiché à l'utilisateur. */
function reportError(error) {
	if (error instanceof ApiError) {
		toast(error.messages.join(' ') || error.message, 'error');
	} else {
		toast("L'API n'a pas répondu.", 'error');
	}
}

/* ------------------------------------------------------------------ drawer */

/** Ouvre le panneau latéral, en création ou en édition. */
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

/** Ferme le panneau latéral. */
function closeDrawer() {
	$('[data-drawer]').hidden = true;
	$('[data-scrim]').hidden = true;
	document.body.style.overflow = '';
	state.editing = null;
}

/** Affiche les messages d'erreur renvoyés par l'API dans le formulaire. */
function showFormError(messages) {
	const box = $('[data-form-error]');
	box.replaceChildren(...messages.map((message) => el('p', { text: message })));
	box.hidden = false;
}

/**
 * Envoie le formulaire.
 *
 * La validation est **délibérément** laissée au serveur : le formulaire
 * n'impose rien, et les messages d'erreur affichés sont ceux de
 * `VALIDATION_MESSAGES` (partie 3 de l'énoncé), ce qui montre le travail
 * de validation côté API.
 */
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

/* ------------------------------------------------------------------- actions */

/** Change le statut d'un todo (glisser-déposer ou édition). */
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

/** Supprime un todo définitivement. */
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

/** Supprime un todo logiquement : il part en corbeille. */
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

/** Restaure un todo depuis la corbeille. */
async function restoreTodo(id) {
	try {
		await api.restore(id);
		toast('Todo restauré.', 'success');
	} catch (error) {
		reportError(error);
	}
	await refresh();
}

/* ------------------------------------------------------------------- events */

function wireEvents() {
	// Création.
	$('#new-todo').addEventListener('click', () => openDrawer());

	// Fermeture du panneau.
	$$('[data-close]').forEach((button) => button.addEventListener('click', closeDrawer));
	$('[data-scrim]').addEventListener('click', closeDrawer);
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !$('[data-drawer]').hidden) closeDrawer();
	});

	// Formulaire.
	$('[data-form]').addEventListener('submit', submitForm);

	// Recherche (différée) et filtre de statut.
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

	// Pagination.
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

	// Actions sur les todos (délégation d'événement : un seul écouteur).
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

	// Glisser-déposer entre colonnes : le statut est mis à jour par l'API.
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

/* ---------------------------------------------------------------- démarrage */

wireEvents();
refresh();
