import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TodoEntity } from './todo.entity.js';
import { StatusEnum } from './status.enum.js';
describe('TodoEntity persistence', () => {
    let dataSource: DataSource;
    beforeEach(async () => {
        dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [TodoEntity],
            synchronize: true,
        });
        await dataSource.initialize();
    });
    afterEach(async () => {
        if (dataSource.isInitialized)
            await dataSource.destroy();
    });
    it('generates ids, defaults, and reusable timestamps', async () => {
        const repository = dataSource.getRepository(TodoEntity);
        const todo = await repository.save(repository.create({
            name: 'Study',
            description: 'Review NestJS modules.',
        }));
        expect(todo.id).toBeGreaterThan(0);
        expect(todo.status).toBe(StatusEnum.TODO);
        expect(todo.createdAt).toBeInstanceOf(Date);
        expect(todo.updatedAt).toBeInstanceOf(Date);
        expect(todo.deletedAt).toBeNull();
    });
    it('preserves createdAt and automatically updates updatedAt', async () => {
        const repository = dataSource.getRepository(TodoEntity);
        const oldDate = new Date('2000-01-01T00:00:00Z');
        const todo = await repository.save(repository.create({
            name: 'Study',
            description: 'Review NestJS modules.',
            createdAt: oldDate,
            updatedAt: oldDate,
        }));
        todo.createdAt = new Date('2010-01-01T00:00:00Z');
        todo.name = 'Build';
        await repository.save(todo);
        const updated = await repository.findOneByOrFail({ id: todo.id });
        expect(updated.createdAt).toEqual(oldDate);
        expect(updated.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
        expect(updated.name).toBe('Build');
    });
    it('sets deletedAt on soft delete and clears it on restore', async () => {
        const repository = dataSource.getRepository(TodoEntity);
        const todo = await repository.save(repository.create({
            name: 'Study',
            description: 'Review NestJS modules.',
        }));
        await repository.softDelete(todo.id);
        expect(await repository.findOneBy({ id: todo.id })).toBeNull();
        const deleted = await repository.findOneOrFail({
            where: { id: todo.id },
            withDeleted: true,
        });
        expect(deleted.deletedAt).toBeInstanceOf(Date);
        await repository.restore(todo.id);
        const restored = await repository.findOneByOrFail({ id: todo.id });
        expect(restored.deletedAt).toBeNull();
    });
});
