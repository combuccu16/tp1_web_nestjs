import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Like, type Repository } from 'typeorm';
import { StatusEnum } from './entity/status.enum.js';
import { TodoEntity } from './entity/todo.entity.js';
import { TodoService } from './todo.service.js';

describe('TodoService read operations', () => {
	const todo = { id: 7, name: 'Read me' } as TodoEntity;
	let repository: Pick<
		Repository<TodoEntity>,
		'findAndCount' | 'findOne' | 'createQueryBuilder' | 'restore'
	>;
	let queryBuilder: {
		select: ReturnType<typeof vi.fn>;
		addSelect: ReturnType<typeof vi.fn>;
		where: ReturnType<typeof vi.fn>;
		groupBy: ReturnType<typeof vi.fn>;
		getRawMany: ReturnType<typeof vi.fn>;
	};
	let service: TodoService;

	beforeEach(() => {
		queryBuilder = {
			select: vi.fn().mockReturnThis(),
			addSelect: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			groupBy: vi.fn().mockReturnThis(),
			getRawMany: vi.fn().mockResolvedValue([]),
		};
		repository = {
			findAndCount: vi.fn().mockResolvedValue([[todo], 1]),
			findOne: vi.fn().mockResolvedValue(todo),
			createQueryBuilder: vi.fn().mockReturnValue(queryBuilder),
			restore: vi.fn().mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] }),
		};
		service = new TodoService(repository as Repository<TodoEntity>);
	});

	it('searches name OR description, combines status, and calculates the page offset', async () => {
		const result = await service.getAll('term', StatusEnum.DONE, 3, 5);
		const options = vi.mocked(repository.findAndCount).mock.calls[0][0];

		expect(options).toMatchObject({ skip: 10, take: 5, order: { id: 'ASC' } });
		expect(options?.where).toEqual([
			{ name: Like('%term%'), status: StatusEnum.DONE },
			{ description: Like('%term%'), status: StatusEnum.DONE },
		]);
		expect(result).toEqual({ data: [todo], page: 3, limit: 5, total: 1 });
	});

	it('returns all results when no filters are provided', async () => {
		await service.getAll();
		expect(repository.findAndCount).toHaveBeenCalledWith(
			expect.objectContaining({ where: {}, skip: 0, take: 10 }),
		);
	});

	it('rejects invalid pagination and statuses', async () => {
		await expect(service.getAll(undefined, undefined, 0)).rejects.toBeInstanceOf(
			BadRequestException,
		);
		await expect(service.getAll(undefined, undefined, 1, 101)).rejects.toBeInstanceOf(
			BadRequestException,
		);
		await expect(service.getAll(undefined, 'UNKNOWN' as StatusEnum)).rejects.toBeInstanceOf(
			BadRequestException,
		);
	});

	it('returns a todo by id and throws 404 when it is missing', async () => {
		await expect(service.getById(7)).resolves.toBe(todo);
		vi.mocked(repository.findOne).mockResolvedValueOnce(null);
		await expect(service.getById(999)).rejects.toBeInstanceOf(NotFoundException);
	});

	it('groups the todos by status in a single query and zero-fills missing statuses', async () => {
		vi.mocked(queryBuilder.getRawMany).mockResolvedValue([
			{ status: StatusEnum.TODO, count: 2 },
			{ status: StatusEnum.DONE, count: 1 },
		]);

		const stats = await service.getStats();

		expect(stats).toEqual({
			total: 3,
			// IN_PROGRESS n'apparaît pas dans le GROUP BY (aucun todo) : il doit rester à 0.
			byStatus: { TODO: 2, IN_PROGRESS: 0, DONE: 1 },
		});
		// Une seule requête, avec un GROUP BY : pas de COUNT séparé par statut.
		expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
		expect(queryBuilder.groupBy).toHaveBeenCalledWith('todo.status');
		expect(queryBuilder.addSelect).toHaveBeenCalledWith('COUNT(*)', 'count');
	});

	it('returns a zero count for every status when there is no todo', async () => {
		vi.mocked(queryBuilder.getRawMany).mockResolvedValue([]);

		const stats = await service.getStats();

		expect(stats).toEqual({
			total: 0,
			byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
		});
	});

	it('restores a soft-deleted todo', async () => {
		await expect(service.restoreTodo(7)).resolves.toEqual({ restored: true, id: 7 });
		expect(repository.restore).toHaveBeenCalledWith(7);
	});

	it('returns 404 when restoring a todo that is not soft-deleted', async () => {
		// TypeORM ajoute `deletedAt IS NOT NULL` à l'UPDATE de restauration :
		// un todo déjà actif n'est jamais restauré, donc `affected` vaut 0.
		vi.mocked(repository.restore).mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] });

		await expect(service.restoreTodo(7)).rejects.toBeInstanceOf(NotFoundException);
	});
});
