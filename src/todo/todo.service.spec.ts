import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Like, type Repository } from 'typeorm';
import { StatusEnum } from './entity/status.enum.js';
import { TodoEntity } from './entity/todo.entity.js';
import { TodoService } from './todo.service.js';

describe('TodoService read operations', () => {
	const todo = { id: 7, name: 'Read me' } as TodoEntity;
	let repository: Pick<Repository<TodoEntity>, 'findAndCount' | 'findOne'>;
	let service: TodoService;

	beforeEach(() => {
		repository = {
			findAndCount: vi.fn().mockResolvedValue([[todo], 1]),
			findOne: vi.fn().mockResolvedValue(todo),
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
});
