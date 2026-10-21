import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('root', () => {
		it('returns the API index instead of the scaffold greeting', () => {
			const index = appController.getIndex();

			expect(index.name).toBe('TP1 RT4 — Todo API');
			expect(index.status).toBe('ok');
			expect(index.stack.database).toBe('SQLite');
		});

		it('documents every public route of the application', () => {
			// Liste stricte : elle oblige à mettre l'index à jour dès qu'une
			// route est ajoutée ou modifiée, pour qu'il reste exact.
			const routes = appController
				.getIndex()
				.endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`);

			expect(routes).toEqual([
				'GET /test-injection/uuid',
				'GET /todos',
				'GET /todos/stats',
				'GET /todos/trash',
				'GET /todos/:id',
				'POST /todos',
				'PATCH /todos/:id',
				'DELETE /todos/:id',
				'DELETE /todos/:id/soft',
				'POST /todos/:id/restore',
			]);
		});

		it('does not expose the "Hello World!" scaffold string', () => {
			expect(JSON.stringify(appController.getIndex())).not.toContain('Hello World');
		});
	});
});
