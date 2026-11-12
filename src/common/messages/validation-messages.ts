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
        isEnum: (values: readonly string[]): string => `Le champ "status" doit être l'une des valeurs suivantes : ${values.join(', ')}.`,
    },
    username: {
        isNotEmpty: 'Le champ "username" est obligatoire.',
        isString: 'Le champ "username" doit être une chaîne de caractères.',
        minLength: 'Le champ "username" doit contenir au moins 3 caractères.',
        maxLength: 'Le champ "username" doit contenir au plus 30 caractères.',
    },
    email: {
        isNotEmpty: 'Le champ "email" est obligatoire.',
        isEmail: 'Le champ "email" doit être une adresse e-mail valide.',
    },
    password: {
        isNotEmpty: 'Le champ "password" est obligatoire.',
        isString: 'Le champ "password" doit être une chaîne de caractères.',
        minLength: 'Le champ "password" doit contenir au moins 6 caractères.',
    },
    role: {
        isEnum: (values: readonly string[]): string => `Le champ "role" doit être l'une des valeurs suivantes : ${values.join(', ')}.`,
    },
    designation: {
        isNotEmpty: 'Le champ "designation" est obligatoire.',
        isString: 'Le champ "designation" doit être une chaîne de caractères.',
    },
    lastname: {
        isNotEmpty: 'Le champ "lastname" est obligatoire.',
        isString: 'Le champ "lastname" doit être une chaîne de caractères.',
    },
    firstname: {
        isNotEmpty: 'Le champ "firstname" est obligatoire.',
        isString: 'Le champ "firstname" doit être une chaîne de caractères.',
    },
    age: {
        isInt: 'Le champ "age" doit être un entier.',
        min: 'Le champ "age" doit être un nombre positif.',
    },
    cin: {
        isNotEmpty: 'Le champ "cin" est obligatoire.',
        isString: 'Le champ "cin" doit être une chaîne de caractères.',
        matches: 'Le champ "cin" doit contenir exactement 8 chiffres.',
    },
    job: {
        isNotEmpty: 'Le champ "job" est obligatoire.',
        isString: 'Le champ "job" doit être une chaîne de caractères.',
    },
    path: {
        isString: 'Le champ "path" doit être une chaîne de caractères.',
    },
    skillIds: {
        isArray: 'Le champ "skillIds" doit être un tableau.',
        isInt: 'Chaque identifiant de "skillIds" doit être un entier.',
    },
} as const;
