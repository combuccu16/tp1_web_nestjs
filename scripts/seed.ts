import { loadEnvFile } from 'node:process';
import Database from 'better-sqlite3';

try {
	loadEnvFile();
} catch (error) {
	if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}

// Boot the application first so TypeORM creates the schema.
const db = new Database(process.env.DB_DATABASE ?? 'db.sqlite', {
	fileMustExist: true,
});

try {
	const seed = db.transaction(() => {
		const { count } = db
			.prepare('SELECT COUNT(*) AS count FROM todos')
			.get() as {
			count: number;
		};
		if (count > 0) {
			console.log('Todos already exist; seed skipped.');
			return;
		}

		const insert = db.prepare(`
      INSERT INTO todos (name, description, status)
      VALUES (?, ?, ?)
    `);
		insert.run('Study', 'Review NestJS dependency injection.', 'TODO');
		insert.run('Build', 'Configure the todo database entities.', 'IN_PROGRESS');
		insert.run('Setup', 'Create the initial NestJS application.', 'DONE');
		console.log('Inserted three test todos.');
	});
	seed();
} finally {
	db.close();
}
