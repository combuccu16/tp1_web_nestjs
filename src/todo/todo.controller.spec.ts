import { NotFoundException, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { StatusEnum } from './entity/status.enum.js';
import { TodoController } from './todo.controller.js';
import { TodoService } from './todo.service.js';

describe('TodoController read routes', () => {
	let app: INestApplication<App>;
	const todo = { id: 7, name: 'Read me' };
	const stats = {
		total: 3,
		byStatus: { TODO: 2, IN_PROGRESS: 0, DONE: 1 },
	};
	const todoService = {
		getAll: vi.fn(),
		getById: vi.fn(),
		getStats: vi.fn(),
		getDeletedTodos: vi.fn(),
		restoreTodo: vi.fn(),
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		todoService.getAll.mockResolvedValue({ data: [todo], page: 1, limit: 10, total: 1 });
		todoService.getById.mockResolvedValue(todo);
		todoService.getStats.mockResolvedValue(stats);
		todoService.getDeletedTodos.mockResolvedValue([{ id: 9, name: 'Trashed' }]);
		todoService.restoreTodo.mockResolvedValue({ restored: true, id: 7 });
		const moduleRef = await Test.createTestingModule({
			controllers: [TodoController],
			providers: [{ provide: TodoService, useValue: todoService }],
		}).compile();
		app = moduleRef.createNestApplication();
		await app.init();
	});

	afterEach(async () => app.close());

	it('serves GET /todos with defaults and forwards optional filters', async () => {
		await request(app.getHttpServer()).get('/todos').expect(200).expect({
			data: [todo],
			page: 1,
			limit: 10,
			total: 1,
		});
		expect(todoService.getAll).toHaveBeenLastCalledWith(undefined, undefined, 1, 10);

		await request(app.getHttpServer())
			.get('/todos?q=plan&status=DONE&page=2&limit=4')
			.expect(200);
		expect(todoService.getAll).toHaveBeenLastCalledWith('plan', StatusEnum.DONE, 2, 4);
	});

	it('serves GET /todos/:id and handles invalid or missing ids', async () => {
		await request(app.getHttpServer()).get('/todos/7').expect(200).expect(todo);
		expect(todoService.getById).toHaveBeenCalledWith(7);

		await request(app.getHttpServer()).get('/todos/not-an-id').expect(400);
		todoService.getById.mockRejectedValueOnce(new NotFoundException('Todo #404 not found'));
		await request(app.getHttpServer()).get('/todos/404').expect(404);
	});

	it('serves GET /todos/stats instead of swallowing it with the :id route', async () => {
		await request(app.getHttpServer()).get('/todos/stats').expect(200).expect(stats);

		// La route littérale doit gagner contre `@Get(':id')` : si l'ordre
		// de déclaration changeait, ParseIntPipe renverrait 400 sur "stats".
		expect(todoService.getStats).toHaveBeenCalled();
		expect(todoService.getById).not.toHaveBeenCalled();
	});

	it('serves GET /todos/trash instead of swallowing it with the :id route', async () => {
		await request(app.getHttpServer())
			.get('/todos/trash')
			.expect(200)
			.expect([{ id: 9, name: 'Trashed' }]);

		// Même piège que pour `/todos/stats` : la route littérale doit être
		// déclarée avant `@Get(':id')`, sinon ParseIntPipe renverrait 400.
		expect(todoService.getDeletedTodos).toHaveBeenCalled();
		expect(todoService.getById).not.toHaveBeenCalled();
	});

	it('serves POST /todos/:id/restore with 200 rather than the default 201', async () => {
		// La restauration ne crée rien : elle change l'état d'une ligne
		// existante, donc 200 OK est le code le plus juste.
		await request(app.getHttpServer())
			.post('/todos/7/restore')
			.expect(200)
			.expect({ restored: true, id: 7 });
		expect(todoService.restoreTodo).toHaveBeenCalledWith(7);
	});
});
