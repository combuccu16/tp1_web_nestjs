/**
 * Injection token for the uuid library.
 *
 * Using a string token with a custom provider (useFactory) lets us control
 * HOW the uuid generator is created and makes the dependency explicit in
 * every consumer via @Inject(UUID).
 */
export const UUID = 'UUID';
