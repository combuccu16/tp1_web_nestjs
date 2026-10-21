import 'reflect-metadata';
import { loadEnvFile } from 'node:process';
import type { DataSourceOptions } from 'typeorm';
import { TodoEntity } from './todo/entity/todo.entity.js';
try {
    loadEnvFile();
}
catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
        throw error;
}
export const dataSourceOptions: DataSourceOptions = {
    type: 'better-sqlite3',
    database: process.env.DB_DATABASE ?? 'db.sqlite',
    entities: [TodoEntity],
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
};
