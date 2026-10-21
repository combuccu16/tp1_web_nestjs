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
	const todoService = {
		getAll: vi.fn(),
		getById: vi.fn(),
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		todoService.getAll.mockResolvedValue({ data: [todo], page: 1, limit: 10, total: 1 });
		todoService.getById.mockResolvedValue(todo);
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
});
