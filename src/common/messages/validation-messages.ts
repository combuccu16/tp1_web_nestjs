/**
 * Centralisation des messages d'erreurs de validation.
 *
 * Un seul fichier à maintenir pour toute l'application : chaque message est
 * défini une fois ici, puis réutilisé par les DTOs qui l'ont besoin.
 */
export const VALIDATION_MESSAGES = {
	name: {
		isNotEmpty: 'Le champ "name" est obligatoire.',
		isString: 'Le champ "name" doit être une chaîne de caractères.',
		minLength: 'Le champ "name" doit contenir au moins 3 caractères.',
		maxLength: 'Le champ "name" doit contenir au plus 10 caractères.',
	},
	description: {
		isNotEmpty: 'Le champ "description" est obligatoire.',
		isString: 'Le champ "description" doit être une chaîne de caractères.',
		minLength: 'Le champ "description" doit contenir au moins 10 caractères.',
	},
	status: {
		// Fabrique de message : les valeurs acceptées sont injectées depuis
		// StatusEnum pour ne jamais les dupliquer (maintenance facilitée).
		isEnum: (values: readonly string[]): string =>
			`Le champ "status" doit être l'une des valeurs suivantes : ${values.join(', ')}.`,
	},
} as const;
