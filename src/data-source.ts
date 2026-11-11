import 'reflect-metadata';
import { loadEnvFile } from 'node:process';
import type { DataSourceOptions } from 'typeorm';
import { TodoEntity } from './todo/entity/todo.entity.js';
import { UserEntity } from './user/entities/user.entity.js';
import { CvEntity } from './cv/entities/cv.entity.js';
import { SkillEntity } from './skill/entities/skill.entity.js';
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
    entities: [TodoEntity, UserEntity, CvEntity, SkillEntity],
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
};
