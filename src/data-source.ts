import 'reflect-metadata';
import { loadEnvFile } from 'node:process';
import type { DataSourceOptions } from 'typeorm';
import { TodoEntity } from './todo/entity/todo.entity.js';

try {
	loadEnvFile();
} catch (error) {
	// A local .env is optional; other errors should not be hidden.
	if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}

// SQLite is used as the DB engine, to faciliate synchronization between project collaborators
export const dataSourceOptions: DataSourceOptions = {
	type: 'better-sqlite3',
	database: process.env.DB_DATABASE ?? 'db.sqlite',
	entities: [TodoEntity],
	synchronize: process.env.DB_SYNCHRONIZE !== 'false',
};
