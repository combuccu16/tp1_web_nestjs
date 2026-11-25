import { SchemaPath, validate } from '@angular/forms/signals';

export const BLACKLISTED_EMAILS: readonly string[] = [
  'spam@cvtech.tn',
  'test@test.com',
  'admin@admin.com',
];

export function blacklistedEmail(
  path: SchemaPath<string>,
  blacklist: readonly string[] = BLACKLISTED_EMAILS,
  options?: { message?: string },
): void {
  const forbidden = new Set(blacklist.map((email) => email.toLowerCase()));

  validate(path, ({ value }) => {
    if (!forbidden.has(value().trim().toLowerCase())) {
      return null;
    }
    return {
      kind: 'blacklistedEmail',
      message: options?.message ?? 'Cette adresse email est interdite.',
    };
  });
}
